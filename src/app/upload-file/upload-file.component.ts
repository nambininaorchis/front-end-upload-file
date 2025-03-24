import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'app-upload-file',
  imports: [],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss'
})
export class UploadFileComponent {
  files: File[] = [];
  previewContent: string | ArrayBuffer | null = null;
  fileType: string | null = null;
  previews: { file: File, content: string }[] = [];
  constructor(private http: HttpClient,private ng2ImgMax: Ng2ImgMaxService) {}

  ngOnInit(): void {}

  onChange(event: any) {
    const files: FileList = event.target.files;
  
    if (files.length) {
      const newFiles = Array.from(files);
      this.files = [...this.files, ...newFiles];
  
      newFiles.forEach((file) => {
        const fileType = file.type;
  
        if (!fileType.startsWith('video')) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.previewContent = e.target.result;
            this.previews.push({ file, content: e.target.result });
          };
          reader.readAsDataURL(file);
        
        } else if (fileType.startsWith('video')) {
          const videoUrl = URL.createObjectURL(file);
          this.previews.push({ file, content: videoUrl });
        } else {
          this.previews.push({ file, content: `Aperçu non disponible pour ce type de fichier (${file.name})` });
        }
      });
    }
  }
  

  onDelete(file: File) {
    this.files = this.files.filter(f => f !== file);
    this.previews = this.previews.filter(p => p.file !== file);
  }

  async onUpload() {
    if (this.files.length) {
      const formData = new FormData();
      for (const file of this.files) {
        const fileType = file.type;
        if (fileType.startsWith('image')) {
          try {
            const compressedFile = await this.compressImageWithNg2ImgMax(file, 0.1);
            formData.append("files", compressedFile, compressedFile.name);
          } catch (error) {
            console.error('Erreur de compression de l\'image', error);
            formData.append("files", file, file.name);
          }
        } else {
          formData.append("files", file, file.name);
        }
      }

      try {
        const response = await this.http.post("http://localhost:3001/file-upload/upload", formData).toPromise();
        alert('Upload réussi')
      } catch (error) {
        console.error('Erreur d\'upload', error);
      }
    } else {
      console.error('Aucun fichier sélectionné pour l\'upload');
    }
  }

  compressImageWithNg2ImgMax(file: File, maxSize: number): Promise<File> {
    return new Promise((resolve, reject) => { 
      this.ng2ImgMax.compressImage(file, maxSize).subscribe(
        (compressedImage) => {
          const compressedFile = new File([compressedImage], file.name, { type: file.type });
          resolve(compressedFile);
        },
        (error) => {
          reject('Erreur de compression : ' + error);
        }
      );
    });
  }

}
