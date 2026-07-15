import { test, expect } from '@playwright/test';
import { TravelMoneyPage } from '../pages/TravelMoneyPage';

test.setTimeout(120000); // 2 minutes

test('New Cash Purchase Flow', async ({ page }) => {
  const travelMoneyPage = new TravelMoneyPage(page);

  // Navigate to add funds page
  await travelMoneyPage.navigateToAddFunds();
  await travelMoneyPage.zoomOut();
  await page.waitForTimeout(2000);

  // Verify initial headings
  await travelMoneyPage.verifyOrderYourCurrencyHeading();
  await travelMoneyPage.verifyHowWouldYouLikeHeading();

  // Veriy Cash and Card buttons available
  await page.locator('//*[@id="Cash"]').isVisible();
  await page.locator('//*[@id="Card"]').isVisible();
  await page.waitForTimeout(2000);

  // Veriy Cash purchase has been added and buttons for Add Cash and Add Card are available
  await page.locator('//*[@id="Cash"]').click();
  await page.getByRole('button', { name: 'Add Cash' }).isVisible();
  await page.getByRole('button', { name: 'Add Card' }).isVisible();
  await page.waitForTimeout(2000);
  // Added Card item only
  await page.getByRole('button', { name: 'Add Card' }).click();

  // Verify Remove button appears after adding a card and that it is clickable
  const removeButton = page.getByRole('button', { name: /Remove/i }).first();
  await expect(removeButton).toBeVisible();
  await page.waitForTimeout(2000);
  await expect(page.locator('body')).toContainText(/Remove/i);
  await removeButton.click();
  await page.waitForTimeout(2000);
  await expect(page.locator('body')).toContainText(/Remove/i);
  await removeButton.click();

  // Veriy Cash and Card buttons available again after removing the card and cash items
  await page.locator('//*[@id="Cash"]').isVisible();
  await page.locator('//*[@id="Card"]').isVisible();
  await page.waitForTimeout(2000);

  // Verify links at the top right
  await expect(page.getByRole('link', { name: 'Store Finder' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Login/Register' })).toBeVisible();
  
  await page.getByText('Important Information').click();
  await page.waitForTimeout(2000);
  const infoText = page.getByText(/Mastercard|Prepaid Management Services/i).first();
  await expect(infoText).toBeVisible();


});