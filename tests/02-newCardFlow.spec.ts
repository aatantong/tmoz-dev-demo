import { test, expect, selectors } from '@playwright/test';

test.setTimeout(120000); // 2 minutes

// Access add funds page
test('New Card Purchase Flow', async ({ page }) => {
await page.goto('https://my-dev.travelmoneyoz.com/purchase/add-funds');

// Resize zoom
await page.evaluate(() => {document.body.style.zoom = '.75';});

// Verify text "Order your currency"
const servicesHeading = page.getByRole('heading',{name: "Order your currency"})
await expect(servicesHeading).toBeVisible()

//Verify text "How would you like your Travel Money?"
const servicesHeading2 = page.getByRole('heading',{name: "How would you like your Travel Money?"})   
await expect(servicesHeading2).toBeVisible()

// Click Card button
await page.locator('//*[@id="Card"]').click();

// Verify You pay is visible
const youPayText = page.getByLabel('You pay')
await expect(youPayText).toBeVisible()

//Add amount for card
await page.getByRole('textbox',{name: 'You pay'}).fill('0')

await page.getByRole('textbox',{name: 'You pay'}).fill('18')

//Click away
await page.mouse.click(10, 10);

//Select country from list
const options = page.locator('[cmdk-item][aria-disabled="false"]');
await page.getByText('USD').click();
await options.nth(Math.floor(Math.random() * await options.count())).click();

await page.getByRole('textbox',{name: 'You pay'}).fill('100')

//Click Next button
const nextButton = page.getByRole('button', { name: 'Next' }).last();
await expect(nextButton).toBeEnabled();
await nextButton.click();



// Delivery or Pick up - Currency Pass card? Yes or No page >>>>>>>>>>>>>>
await expect(page.getByRole('heading', { name: 'Travel Money Card' })).toBeVisible();
await Promise.all([
page.waitForLoadState('load'),
page.locator('//*[@id="Not yet"]/span[2]').click()]);

//Click Next button
const nextButtonCurrencyPassCard = page.getByRole('button', { name: 'Next' }).last();
await expect(nextButtonCurrencyPassCard).toBeEnabled();
await nextButtonCurrencyPassCard.click();



// Your personalised card page >>>>>>>>>>>>>>
await expect(page.getByRole('heading', { name: 'Your personalised card' })).toBeVisible();

//Click Next button
const nextButtonPersonalisedCard = page.getByRole('button', { name: 'Next' }).last();
await expect(nextButtonPersonalisedCard).toBeEnabled();
await nextButtonPersonalisedCard.click();



//Personal Details page - What's your email >>>>>>>>>>>>>>
const emailHeader = page.getByRole('heading', {name: 'What’s your email?'});
await emailHeader.isVisible();

//Generate random email
function generateRandomEmail() {
const now = new Date();

const year = String(now.getFullYear()).slice(-2); // 2-digit year
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
return `tmoztestdev+aw${timestamp}@gmail.com`;}

//Enter generated email to email input field
const email = generateRandomEmail();
console.log('Generated email:', email);

//Locate email input field
const emailInput = page.locator('input[name="email"]');

//Fill email field
await emailInput.fill(email);

//Optional: verify the value
await expect(emailInput).toHaveValue(email);

//Click Next button
const nextButton2 = page.getByRole('button', { name: 'Next' }).last();
await expect(nextButton2).toBeEnabled();
await nextButton2.click();



//Personal Details page >>>>>>>>>>>>>>
await page.getByRole('combobox', { name: 'Title' }).click();
await page.getByRole('option', { name: 'Miss', exact: true }).click();

//Create random names with prefix Auto
const letters = 'abcdefghijklmnopqrstuvwxyz';
const length = Math.floor(Math.random() * 4) + 5; // 5–8 letters
let randomPart = '';

for (let i = 0; i < length; i++) {
randomPart += letters.charAt(Math.floor(Math.random() * letters.length));
}
const firstName = `Auto${randomPart}`;

await page.locator('input[name="name.firstName"]').click();
await page.locator('input[name="name.firstName"]').fill(firstName);
await page.locator('input[name="name.lastName"]').fill('Dev');
await page.getByRole('group').click();

//Open the year dropdown
//Generate random year
const randomYear = Math.floor(Math.random() * (2000 - 1980 + 1)) + 1980;
//console.log('Random year selected:', randomYear);

//Scroll year container if needed
await page.getByRole('button', { name: 'calendar view is open, switch' }).click();
const yearContainer = page.locator('.MuiYearCalendar-root');
while (!(await page.locator(`button:has-text("${randomYear}")`).isVisible())) {
await yearContainer.evaluate(el => el.scrollBy(0, -100)); // scroll up
await page.waitForTimeout(1000);
}
// Click random year
await page.locator(`button:has-text("${randomYear}")`).click();

// Generate random day
const randomDay = Math.floor(Math.random() * 28) + 1;
//console.log('Random day selected:', randomDay);

// Click random day in calendar
await page.getByRole('gridcell', { name: randomDay.toString(), exact: true }).click();

//Create a random mobile number that starts with 4 + 8 digit numbers from 0-9
const randomNumber = '4' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
//console.log(randomNumber);

//Enter mobile phone
const mobileInput = page.locator('input[name="mobileNumber"]');
await mobileInput.fill(randomNumber);

//Add address
const addressField2 = page.getByRole('combobox', {name: /Start typing your address/i});
await addressField2.scrollIntoViewIfNeeded();
await addressField2.click();
await addressField2.clear();
await addressField2.pressSequentially('1 Eagle St', { delay: 100 });
await page.waitForSelector('[role="option"]');

//Select first option using keyboard
await page.keyboard.press('ArrowDown');
await page.keyboard.press('Enter');
// Wait for the error message to disappear
await page.waitForSelector('.error-message', { state: 'detached' });
await page.waitForTimeout(3000);

//Tick Illion and Experian checkbox
const illionExperianCheckbox = page.locator('input[name="creditCheckConsent"]');
await illionExperianCheckbox.click();

//Click Next button
await page.getByRole('button', { name: 'Next' }).click();
await page.keyboard.press('Tab');
await page.mouse.click(10, 10);
await page.waitForTimeout(3000);
// await nextButton.scrollIntoViewIfNeeded();
// await page.getByRole('button', { name: 'Next' }).isEnabled();
// await page.getByRole('button', { name: 'Next' }).click();



//Check ID >>>>>>>>>>>>>>
await page.getByText('We need to check your ID').isVisible();
await page.getByText('Australian passport').click();
const passportInput = page.locator('input[name="passportNumber"]');
await passportInput.scrollIntoViewIfNeeded();
await passportInput.fill('A1111111');
await page.keyboard.press('Tab');
await page.locator('input[type="checkbox"]').first().check();

//Click Next button
await page.keyboard.press('Tab');
await nextButton.scrollIntoViewIfNeeded();
await page.getByRole('button', { name: 'Next' }).isEnabled();
await page.getByRole('button', { name: 'Next' }).click();



//Additional Check ID >>>>>>>>>>>>>>
const additionalCheckID = page.getByRole('heading', {name: 'We need to check your ID'});
await additionalCheckID.isVisible();
await expect(page.getByText(/passport was successfully verified/i)).toBeVisible();
await page.locator('//*[@id="Australian electoral roll"]').click();
await page.getByLabel(/I agree that my above information/i).check();

//Click Next button
await page.keyboard.press('Tab');
await nextButton.scrollIntoViewIfNeeded();
await page.getByRole('button', { name: 'Next' }).isEnabled();
await page.getByRole('button', { name: 'Next' }).click();



//Click Create Account option >>>>>>>>>>>>>>
const createAccountButton = page.locator('//*[@id="Create Account"]/span[2]');
await createAccountButton.click();
await page.locator('input[name="password"]').fill('Passw0rd!');
await page.locator('input[name="confirmPassword"]').fill('Passw0rd!');
await page.locator('input[name="mothersMaidenName.answer"]').fill('Password');

//Click Next button
const nextButton4 = page.getByRole('button', { name: 'Next' });
await nextButton4.scrollIntoViewIfNeeded();
await expect(nextButton4).toBeEnabled();
await nextButton4.click();



//Payment page >>>>>>>>>>>>>>
//const debitCreditRadioButton = page.getByRole('radio', { name: 'Debit or Credit Card' }).isVisible();
await page.locator('//*[@id="Credit Card"]').click()
const cardNumber = page.locator('iframe[title="Iframe for card number"]').contentFrame().getByRole('textbox', { name: 'Card number' })
await cardNumber.fill('5454545454545454')
const cardExpiryDate = page.locator('iframe[title="Iframe for expiry date"]').contentFrame().getByRole('textbox', { name: 'Expiry date' })
await cardExpiryDate.fill('03/30')
const securityCode = page.locator('iframe[title="Iframe for security code"]').contentFrame().getByRole('textbox', { name: 'Security code' })
await securityCode.fill('737')
const randomCardName = Math.random().toString(36).substring(2, 8);
const capitalized = randomCardName.charAt(0).toUpperCase() + randomCardName.slice(1);
const randomFullName = `Test ${capitalized}`;
await page.getByRole('textbox', { name: 'Name on card' }).fill(randomFullName);
console.log('Generated name:', randomFullName);

//Click away
await page.mouse.click(10, 10);
await page.keyboard.press('Tab');

//Credit card fee pop up
//Get the dialog
const feesDialog = page.getByRole('dialog', { name: /Let's talk fees/i });
await feesDialog.isVisible();

//Click the checkbox inside the dialog
await feesDialog.getByRole('checkbox').check();

//Click the Proceed button
const proceedButton = feesDialog.getByRole('button', { name: 'Proceed' });
await proceedButton.click();

//Confirm payment
await page.getByRole('checkbox', { name: 'I have read, understand and' }).isVisible()
await page.getByRole('checkbox', { name: 'I have read, understand and' }).click()
await page.getByRole('button', { name: 'Purchase Currency' }).isEnabled()
await page.getByRole('button', { name: 'Purchase Currency' }).click()

//Adyen page
const adyenFrame = page.frameLocator('iframe[name="threeDSIframe"]');
await adyenFrame.locator('#password-input').fill('password');
await adyenFrame.locator('#buttonSubmit').click();

//Order Confirmation page >>>>>>>>>>>>>>
//await page.waitForLoadState('domcontentloaded');
const orderComplete = page.getByRole('heading', { name: /order complete/i });
await expect(orderComplete).toBeVisible({ timeout: 60000 });
await expect(page.getByRole('heading', { name: 'Thank you for shopping with us!' })).toBeVisible();
const orderHeading = page.getByRole('heading', { name: /has been confirmed/i });
await expect(orderHeading).toBeVisible();
const orderText = await orderHeading.textContent();
const orderNumber = orderText?.match(/#(\w+)/)?.[1];
console.log('Order Number:', orderNumber);


})