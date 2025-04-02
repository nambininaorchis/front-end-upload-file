import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
});

test('Test 1: Ajouter un fichier, afficher les aperçus et télécharger les fichiers', async ({ page }) => {
  const chooseButton = page.locator('input[type="file"]');
  await chooseButton.setInputFiles('./files/right.svg');
  const imagePreview = page.locator('img[alt="Aperçu du fichier"]');
  await expect(imagePreview).toBeVisible();
  const uploadButton = page.locator('.upload-button');
  await uploadButton.click();
  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Upload réussi'); 
  });
});

test('Test 2: Ajouter un fichier, afficher les aperçus et supprimer l\'élément', async ({ page }) => {
  const chooseButton = page.locator('input[type="file"]');
  await chooseButton.setInputFiles('./files/right.svg');
  const imagePreview = page.locator('img[alt="Aperçu du fichier"]');
  await expect(imagePreview).toBeVisible();
  const deleteButton = page.locator('button', { hasText: 'Supprimer' });
  await deleteButton.click();
  await expect(imagePreview).not.toBeVisible();
});
