import { Component } from '@angular/core';
import { UploadFileComponent } from "./upload-file/upload-file.component";
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  imports: [ UploadFileComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'upload-file';
}
