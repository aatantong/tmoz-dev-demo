import { test, expect, selectors } from '@playwright/test';

test.setTimeout(120000); // 2 minutes

// Access add funds page
test('New Cash Purchase Flow', async ({ page }) => {
await page.goto('https://my-dev.travelmoneyoz.com/purchase/add-funds');

//Login page
await page.click('text=Login/Register')

const usernameEmail = 'test.tmoz.identity+Da0@gmail.com'
const passwordValue = 'Passw0rd!'
await page.fill('#username', usernameEmail)
await page.fill('#password', passwordValue)

await page.getByRole('button', { name: 'Login' }).isEnabled()
await page.getByRole('button', { name: 'Login' }).click()

// Locate the parent menu block
const currencyCardMenu = page.locator('li.has-children', {
  has: page.getByRole('link', { name: 'Currency Card' })
});
// If submenu requires click to expand
await currencyCardMenu.getByRole('link', { name: 'Currency Card' }).click();
// Click child item
await currencyCardMenu.getByRole('link', { name: 'Reload Card' }).click();
// Optional navigation check
await page.waitForURL('**/add-funds');

//Resize zoom
await page.getByRole('link', { name: 'Log out'}).isVisible()
await page.evaluate(() => {document.body.style.zoom = '.75';})

//Reload page start page - Verify text "How would you like your Travel Money?"
const servicesHeading = page.getByRole('heading',{name: "How much currency would you like?"})   
await expect(servicesHeading).toBeVisible()

//Select country from list
//Open the dropdown
const currencyDropdown = page.locator('span:has-text("USD")'); 
await currencyDropdown.click();
//Get all available options that are NOT disabled
const options = await page.locator('div[cmdk-item]:not([data-disabled="true"])').all();
//Pick a random index
const randomIndex = Math.floor(Math.random() * options.length);
//Click the randomly chosen option
await options[randomIndex].click();

//Add amount for card
await page.getByRole('textbox',{name: 'You pay'}).fill('')
await page.getByRole('textbox',{name: 'You pay'}).fill('149.55')

//Click Next button
const nextButton = page.getByRole('button', { name: 'Next' }).last()
await expect(nextButton).toBeEnabled();
await nextButton.click()



//Payment page >>>>>>>>>>>>>>
//const debitCreditRadioButton = page.getByRole('radio', { name: 'Debit or Credit Card' }).isVisible();
await page.locator('//*[@id="Credit Card"]').click()
// const cardNumber = page.locator('iframe[title="Iframe for card number"]').contentFrame().getByRole('textbox', { name: 'Card number' })
// await cardNumber.fill('5454545454545454')

const cardNumber = page.locator('iframe[title="Iframe for card number"]').contentFrame().getByRole('textbox', { name: 'Card number' })
await cardNumber.fill('4917610000000000')
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

//Accept terms and agreement
await page.mouse.click(10, 10);
await page.keyboard.press('Tab');
await page.locator('//*[@id="root"]/main/form/div[2]/div[2]/button').click()
await page.getByRole('button', { name: 'Purchase Currency' }).isEnabled()
await page.getByRole('button', { name: 'Purchase Currency' }).click()
//await page.waitForTimeout(20000);

//Adyen page
// const adyenFrame = page.frameLocator('iframe[name="threeDSIframe"]');
// await adyenFrame.locator('#password-input').fill('password');
// await adyenFrame.locator('#buttonSubmit').click();

//Order Confirmation page >>>>>>>>>>>>>>
//await page.waitForLoadState('domcontentloaded');
const orderComplete = page.getByRole('heading', { name: /order complete/i });


});