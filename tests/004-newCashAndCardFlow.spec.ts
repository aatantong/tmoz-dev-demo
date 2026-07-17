import { test, expect } from '@playwright/test';
import { TravelMoneyPage } from '../pages/TravelMoneyPage';

// New Cash and Card Purchase Flow - Delivery
// With Adyen

test.setTimeout(120000); // 2 minutes

test('New Card Purchase Flow', async ({ page }) => {
  const travelMoneyPage = new TravelMoneyPage(page);

  // Navigate to add funds page
  await travelMoneyPage.navigateToAddFunds();
  await travelMoneyPage.zoomOut();
  await page.waitForTimeout(3000);

  // Initial verification
  await travelMoneyPage.verifyOrderYourCurrencyHeading();
  await travelMoneyPage.verifyHowWouldYouLikeHeading();

  // Select card option and enter amount
  await travelMoneyPage.selectCardOption();
  await travelMoneyPage.verifyYouPayFieldVisible();
  await travelMoneyPage.enterCardAmount('100');
  await travelMoneyPage.clickAway();

  // Select cash option and enter amount
  await page.getByRole('button', { name: 'Add Cash' }).click();
  const cashSection = page.locator('div').filter({
    has: page.locator('h4', { hasText: /^Cash$/ }),
  }).first();
  const cashAmountInput = cashSection.getByLabel('You pay').first();
  await expect(cashAmountInput).toBeVisible();
  await cashAmountInput.fill('100');
  await page.waitForTimeout(3000);
  await travelMoneyPage.clickAway();
  await travelMoneyPage.clickNextButton();

  // Currency pass card selection
  await page.waitForTimeout(3000);
  await travelMoneyPage.verifyTravelMoneyCardHeading();
  await travelMoneyPage.selectCurrencyPassCardOption('Not yet');
  await travelMoneyPage.clickNextButtonForCurrencyPassCard();

  // Delivery or Pick-Up page
  await page.waitForTimeout(3000);
  await travelMoneyPage.selectClickAndCollectOption();
  await page.getByPlaceholder('Enter address, suburb or postcode').fill('1 Eagle Street');
  
  const findStoreButton = page.getByRole('button', { name: 'Find Store' });
  await findStoreButton.waitFor({ state: 'visible' });
  await findStoreButton.click();
  await page.getByRole('option', {
  name: /1 Eagle Street, Brisbane City QLD, Australia/i}).click();
  await page.waitForTimeout(5000);
  await page.locator('input[type="radio"][name="Travel Money Oz Brookside"]').check();
  await travelMoneyPage.clickNextButton();

  // Email page
  await travelMoneyPage.verifyEmailHeader();
  const email = await travelMoneyPage.generateRandomEmail();
  console.log('Generated email:', email);
  await travelMoneyPage.fillEmailFieldNewCard(email);
  await travelMoneyPage.clickNextButton();

  // Personal details page
  await page.getByRole('combobox', { name: 'Title' }).click();
  await page.getByRole('option', { name: 'Miss', exact: true }).click();

  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const length = Math.floor(Math.random() * 4) + 5;
  let randomPart = '';
  for (let i = 0; i < length; i++) {
    randomPart += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const firstName = `Auto${randomPart}`;

  await page.locator('input[name="name.firstName"]').click();
  await page.locator('input[name="name.firstName"]').fill(firstName);
  await page.locator('input[name="name.lastName"]').fill('Dev');

// Set Date of Birth
  const randomDay = Math.floor(Math.random() * 28) + 1;
  await page.locator('//*[@id="mui-component-select-dateOfBirth.day"]').click();
  await page.waitForTimeout(2000);
  const dayOption = page.locator(
    `ul[role="listbox"] li[role="option"][data-value="${randomDay}"]`
  );
  await expect(dayOption).toBeVisible();
  await dayOption.click();

  // Set Month
  await page.locator('//*[@id="mui-component-select-dateOfBirth.month"]').click();
  const randomMonthNumber = Math.floor(Math.random() * 12) + 1;
  const monthOption = page.locator(
    `ul[role="listbox"] li[role="option"][data-value="${randomMonthNumber}"]`
  );
  await expect(monthOption).toBeVisible();
  await monthOption.click();

  // Set Year (between 1950 and 2000)
  await page.locator('//*[@id="mui-component-select-dateOfBirth.year"]').click();
  const minYear = 1950;
  const maxYear = 2000;
  const randomYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  //console.log(`Selecting year: ${randomYear}`);
  const yearOption = page.locator(
    `ul[role="listbox"] li[role="option"][data-value="${randomYear}"]`
  );
  await expect(yearOption).toBeVisible();
  await yearOption.click();

  // Enter mobile number (4 + 8 random digits)
  const randomNumber = '4' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
  const mobileInput = page.locator('input[name="mobileNumber"]');
  await mobileInput.fill(randomNumber);

  // Enter address
  const addressField2 = page.getByRole('combobox', { name: /Start typing your address/i });
  await addressField2.scrollIntoViewIfNeeded();
  await addressField2.click();
  await addressField2.clear();
  await addressField2.pressSequentially('1 Eagle Street', { delay: 100 });

  const addressOption = page
    .getByRole('option')
    .filter({ hasText: /1 Eagle St/i })
    .first();
  await expect(addressOption).toBeVisible({ timeout: 10000 });
  await addressOption.click();

  await page.waitForSelector('.error-message', { state: 'detached' });
  await page.waitForTimeout(3000);
  await page.locator('input[name="creditCheckConsent"]').click();

  // Click Next button
  const nextButton3 = page.getByRole('button', { name: /^Next$/ });
  await nextButton3.click();

  // ID check
  await page.getByText('We need to check your ID').isVisible();
  await page.getByText('Australian passport').click();
  await page.locator('input[name="passportNumber"]').scrollIntoViewIfNeeded();
  await page.locator('input[name="passportNumber"]').fill('A1111111');
  await page.keyboard.press('Tab');
  await page.locator('input[type="checkbox"]').first().check();
  await page.keyboard.press('Tab');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Next' }).isEnabled();
  await page.getByRole('button', { name: 'Next' }).click();

  const additionalCheckID = page.getByRole('heading', { name: 'We need to check your ID' });
  await additionalCheckID.isVisible();
  await expect(page.getByText(/passport was successfully verified/i)).toBeVisible();
  await page.locator('//*[@id="Australian electoral roll"]').click(); 
  await page.getByLabel(/I agree that my above information/i).check();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Next' }).isEnabled();
  await page.getByRole('button', { name: 'Next' }).click();

  // Create account
  await page.locator('//*[@id="Create Account"]/span[2]').click();
  await page.locator('input[name="password"]').fill('Passw0rd!');
  await page.locator('input[name="confirmPassword"]').fill('Passw0rd!');
  await page.locator('input[name="mothersMaidenName.answer"]').fill('Password');
  const nextButton4 = page.getByRole('button', { name: 'Next' });
  await nextButton4.scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000);
  await expect(nextButton4).toBeEnabled();
  await nextButton4.click();

  // Payment page - Select credit card
  await travelMoneyPage.selectCreditCard();
  await travelMoneyPage.fillCardNumber('5454545454545454');
  await travelMoneyPage.fillCardExpiryDate('03/30');
  await travelMoneyPage.fillSecurityCode('737');
  const cardholderName = await travelMoneyPage.generateRandomCardholderName();
  await travelMoneyPage.fillNameOnCard(cardholderName);
  await page.waitForTimeout(5000);

  // Accept card fee dialog
  await travelMoneyPage.clickAwayAndTabNavigation();
  await travelMoneyPage.acceptCardFeeDialog();
  await page.waitForTimeout(10000);

  // Accept terms and complete payment
  await page.getByRole('checkbox', { name: 'I have read, understand and' }).isVisible();
  await page.getByRole('checkbox', { name: 'I have read, understand and' }).click();
  await page.getByRole('button', { name: 'Purchase Currency' }).isEnabled();
  await page.getByRole('button', { name: 'Purchase Currency' }).click();
  await page.waitForTimeout(5000);

// Handle 3DS authentication if it appears
  //await page.waitForSelector('iframe[name="threeDSIframe"]', {timeout: 10000,});
  const threeDSFrame = page.frameLocator('iframe[name="threeDSIframe"]');
  await threeDSFrame.locator('#password-input').fill('password');
  await threeDSFrame.locator('//*[@id="buttonSubmit"]').click();

  // Verify Order Confirmation page
  await expect(page.getByRole('heading', { name: 'Thank you for shopping with us!' })).toBeVisible({ timeout: 60000 });
  const orderHeading = page.getByRole('heading', { name: /has been confirmed/i });
  await expect(orderHeading).toBeVisible();
  const orderText = await orderHeading.textContent();
  const orderNumber = orderText?.match(/#(\w+)/)?.[1];
  console.log('Order Number:', orderNumber);

});