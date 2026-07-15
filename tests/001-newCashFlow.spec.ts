import { test, expect } from '@playwright/test';
import { TravelMoneyPage } from '../pages/TravelMoneyPage';

// New Cash Purchase Flow - Delivery
// No Adyen

test.setTimeout(120000); // 2 minutes

test('New Cash Purchase Flow', async ({ page }) => {
  const travelMoneyPage = new TravelMoneyPage(page);

  // Navigate to add funds page
  await travelMoneyPage.navigateToAddFunds();
  await travelMoneyPage.zoomOut();
  await page.waitForTimeout(3000);

  // Verify initial headings
  await travelMoneyPage.verifyOrderYourCurrencyHeading();
  await travelMoneyPage.verifyHowWouldYouLikeHeading();

  // Select cash option and enter amount
  await travelMoneyPage.selectCashOption();
  await travelMoneyPage.verifyYouPayFieldVisible();
  await travelMoneyPage.enterCashAmount('200');

  // Navigate to next page
  await travelMoneyPage.clickAway();
  await travelMoneyPage.clickNextButton();

  // Delivery or Pick-Up page
  await travelMoneyPage.verifyDeliveryOrPickUpHeading();
  await travelMoneyPage.selectDeliveryOption();
  await travelMoneyPage.verifyYourDeliveryAddressHeading();
  await travelMoneyPage.enterDeliveryAddress('1 Eagle Street');
  await travelMoneyPage.verifyDeliveryScheduleHeading();
  await travelMoneyPage.selectDeliverySchedule('Tomorrow', 'Lunch');
  await travelMoneyPage.verifyDeliveryFeeText();
  await travelMoneyPage.clickNextButton();

  // Email page
  await travelMoneyPage.verifyEmailHeader();
  const email = await travelMoneyPage.generateRandomEmail();
  console.log('Generated email:', email);
  await travelMoneyPage.fillEmailFieldNewCash(email);
  await travelMoneyPage.clickNextButton();

  // Personal details page - Title, name, and DOB
  await page.getByRole('combobox', { name: 'Title' }).click();
  await page.getByRole('option', { name: 'Mr', exact: true }).click();

  // Generate random first name with Auto prefix
  // Frist name
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const length = Math.floor(Math.random() * 4) + 4; // 5–8 letters
  let randomPart = '';
  for (let i = 0; i < length; i++) {
    randomPart += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const firstName = `Auto${randomPart}`;

  // Last name
  const lastLength = Math.floor(Math.random() * 4) + 4;
  let lastRandom = '';
  for (let i = 0; i < lastLength; i++) {
    lastRandom += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const lastName = `Dev${lastRandom}`;

  await page.locator('input[name="name.firstName"]').click();
  await page.locator('input[name="name.firstName"]').fill(firstName);
  await page.locator('input[name="name.lastName"]').fill(lastName);

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
  await addressField2.pressSequentially('1 Eagle St', { delay: 100 });
  await page.waitForSelector('[role="option"]');

  // Select address option from dropdown
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.mouse.click(10, 10);
  await page.waitForTimeout(3000);

  // Click Next button
  const nextButton3 = page.getByRole('button', { name: /^Next$/ });
  await nextButton3.click();

  // Create Account
  const createAccountButton = page.locator('//*[@id="Create Account"]/span[2]');
  await createAccountButton.click();
  await page.locator('input[name="password"]').fill('Passw0rd!');
  await page.locator('input[name="confirmPassword"]').fill('Passw0rd!');
  await page.locator('input[name="mothersMaidenName.answer"]').fill('Password');

  // Click Next button
  const nextButton4 = page.getByRole('button', { name: 'Next' });
  await nextButton4.scrollIntoViewIfNeeded();
  await expect(nextButton4).toBeEnabled();
  await nextButton4.click();

  // Payment page - Select credit card
  await travelMoneyPage.selectCreditCard();
  await travelMoneyPage.fillCardNumber('4917610000000000');
  await travelMoneyPage.fillCardExpiryDate('03/30');
  await travelMoneyPage.fillSecurityCode('737');
  const cardholderName = await travelMoneyPage.generateRandomCardholderName();
  await travelMoneyPage.fillNameOnCard(cardholderName);

  // Accept card fee dialog
  await travelMoneyPage.clickAwayAndTabNavigation();
  await travelMoneyPage.acceptCardFeeDialog();

  // Accept terms and complete payment
  await page.getByRole('checkbox', { name: 'I have read, understand and' }).isVisible();
  await page.getByRole('checkbox', { name: 'I have read, understand and' }).click();
  await page.getByRole('button', { name: 'Purchase Currency' }).isEnabled();
  await page.getByRole('button', { name: 'Purchase Currency' }).click();
  await page.waitForTimeout(3000);

  // Handle 3DS authentication if it appears
  console.log('Current URL before 3DS check:', page.url());
  try {
    // First check if we're on the Adyen 3DS page (main page context)
    const testSimulatorHeading = page.locator('h1:has-text("TEST SIMULATOR")');
    if (await testSimulatorHeading.isVisible({ timeout: 5000 }).catch(() => false)) {
      //console.log('Found TEST SIMULATOR heading on main page');
      // Fill password input
      const passwordInput = page.locator('input[placeholder*="password" i]');
      await passwordInput.fill('password');

      // Click Continue button
      const continueButton = page.locator('button:has-text("Continue")');
      await continueButton.click();

      // Wait for navigation back to main page
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);
    } else {
      //console.log('TEST SIMULATOR not found on main page, checking frames...');
      // Check frames for 3DS iframe
      const frames = page.frames();
      for (const frame of frames) {
        try {
          const frameTestSimulator = frame.locator('h1:has-text("TEST SIMULATOR")');
          if (await frameTestSimulator.isVisible({ timeout: 3000 }).catch(() => false)) {
            console.log('Found TEST SIMULATOR in frame');
            // Fill password input in frame
            const framePasswordInput = frame.locator('input[placeholder*="password" i]');
            await framePasswordInput.fill('password');

            // Click Continue button in frame
            const frameContinueButton = frame.locator('button:has-text("Continue")');
            await frameContinueButton.click();

            // Wait for navigation back to main page
            await page.waitForLoadState('networkidle').catch(() => {});
            await page.waitForTimeout(2000);
            break;
          }
        } catch (e) {
          //console.log('Error checking frame:', e.message);
          // Try next frame
        }
      }
    }
  } catch (e) {
    //console.log('3DS handling error:', e.message);
    // 3DS might not be required, continue
  }
  console.log('Current URL after 3DS check:', page.url());
  // Verify Order Confirmation page
  await expect(page.getByRole('heading', { name: 'Thank you for shopping with us!' })).toBeVisible({ timeout: 60000 });
  const orderHeading = page.getByRole('heading', { name: /has been confirmed/i });
  await expect(orderHeading).toBeVisible();
  const orderText = await orderHeading.textContent();
  const orderNumber = orderText?.match(/#(\w+)/)?.[1];
  console.log('Order Number:', orderNumber);
});
