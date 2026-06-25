import { Page, expect } from '@playwright/test';

export class TravelMoneyPage {
  constructor(private page: Page) {}

  // ============ Navigation ============
  async navigateToAddFunds() {
    await this.page.goto('https://my-dev.travelmoneyoz.com/purchase/add-funds');
  }

  async zoomOut() {
    await this.page.evaluate(() => {
      document.body.style.zoom = '.75';
    });
  }

  // ============ Login Flow ============
  async clickLoginRegister() {
    await this.page.click('text=Login/Register');
  }

  async loginWithCredentials(email: string, password: string) {
    await this.page.fill('#username', email);
    await this.page.fill('#password', password);
    await this.page.getByRole('button', { name: 'Login' }).isEnabled();
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async navigateToReloadCard() {
    const currencyCardMenu = this.page.locator('li.has-children', {
      has: this.page.getByRole('link', { name: 'Currency Card' }),
    });
    await currencyCardMenu
      .getByRole('link', { name: 'Currency Card' })
      .click();
    await currencyCardMenu
      .getByRole('link', { name: 'Reload Card' })
      .click();
    await this.page.waitForURL('**/add-funds');
  }

  async verifyLogoutLinkVisible() {
    await this.page.getByRole('link', { name: 'Log out' }).isVisible();
  }

  // ============ Initial Headings ============
  async verifyOrderYourCurrencyHeading() {
    const servicesHeading = this.page.getByRole('heading', {
      name: 'Order your currency',
    });
    await expect(servicesHeading).toBeVisible();
  }

  async verifyHowWouldYouLikeHeading() {
    const servicesHeading2 = this.page.getByRole('heading', {
      name: 'How would you like your Travel Money?',
    });
    await expect(servicesHeading2).toBeVisible();
  }

  async verifyHowMuchCurrencyHeading() {
    const servicesHeading = this.page.getByRole('heading', {
      name: 'How much currency would you like?',
    });
    await expect(servicesHeading).toBeVisible();
  }

  // ============ Cash Flow ============
  async selectCashOption() {
    await this.page.locator('//*[@id="Cash"]').click();
  }

  async enterCashAmount(amount: string) {
    await this.page.getByRole('textbox', { name: 'You pay' }).fill('0');
    await this.page.getByRole('textbox', { name: 'You pay' }).fill(amount);
  }

  // ============ Card Flow ============
  async selectCardOption() {
    await this.page.locator('//*[@id="Card"]').click();
  }

  async enterCardAmount(amount: string) {
    await this.page.getByRole('textbox', { name: 'You pay' }).fill('0');
    await this.page.getByRole('textbox', { name: 'You pay' }).fill(amount);
  }

  // ============ Currency Selection ============
  async selectRandomCurrencyNewCard(initialAmount: string) {
    const options = this.page.locator('[cmdk-item][aria-disabled="false"]');
    await this.page.getByText('USD').click();
    await options
      .nth(Math.floor(Math.random() * (await options.count())))
      .click();
    await this.page
      .getByRole('textbox', { name: 'You pay' })
      .fill(initialAmount);
  }

  async selectRandomCurrencyReload() {
    const currencyDropdown = this.page.locator('span:has-text("USD")');
    await currencyDropdown.click();
    const options = await this.page
      .locator('div[cmdk-item]:not([data-disabled="true"])')
      .all();
    const randomIndex = Math.floor(Math.random() * options.length);
    await options[randomIndex].click();
  }

  // ============ Generic Interactions ============
  async verifyYouPayFieldVisible() {
    const youPayText = this.page.getByLabel('You pay');
    await expect(youPayText).toBeVisible();
  }

  async clickAway() {
    await this.page.mouse.click(10, 10);
  }

  async clickNextButton() {
    const nextButton = this.page.getByRole('button', { name: 'Next' }).last();
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
  }

  // ============ Delivery/Pickup Flow ============
  async verifyDeliveryOrPickUpHeading() {
    await expect(
      this.page.locator('//*[@id="root"]/div[3]/div[1]/h2')
    ).toHaveText('How would you like to receive your cash?');
  }

  async selectDeliveryOption() {
    await this.page.locator('//*[@id="Delivery"]').click();
  }

  async selectClickAndCollectOption() {
   await this.page.locator('label:has-text("Click and Collect")').click();
  }

  async verifyYourDeliveryAddressHeading() {
    const yourDeliveryAddressText = this.page.locator(
      '//*[@id="root"]/div[3]/div[1]/div[2]/div[1]/h2'
    );
    await expect(yourDeliveryAddressText).toHaveText('Your delivery address');
  }

  async enterDeliveryAddress(address: string) {
    const addressField = this.page.locator('//*[@id=":rc:"]');
    await addressField.focus();
    await this.page.keyboard.press('PageUp');

    const addressFieldTextBox = this.page.locator('//*[@id=":rc:"]');
    await addressFieldTextBox.fill(address);

    const addressListResults = this.page.locator('//*[@id=":rc:-listbox"]');
    await addressListResults
      .locator(`text=${address}, Brisbane City QLD, Australia`)
      .click();
  }

  async verifyDeliveryScheduleHeading() {
    const deliveryScheduleText = this.page.locator(
      '//*[@id="root"]/div[3]/div[1]/div[3]/h2'
    );
    await deliveryScheduleText.isVisible();
  }

  async selectDeliverySchedule(day: string, time: string) {
    const scheduleDelivery = this.page.locator('//*[@id="scheduleDelivery"]');
    await scheduleDelivery.click();
    await this.page.locator(`//*[@id="${day}"]`).click();
    await this.page.locator(`//*[@id="${time}"]`).click();
  }

  async verifyDeliveryFeeText() {
    const deliveryFeeText = this.page.locator(
      '//*[@id="root"]/div[3]/div[1]/div[6]'
    );
    await deliveryFeeText.scrollIntoViewIfNeeded();
    await expect(deliveryFeeText).toContainText('delivery to this address');
  }

  // ============ Currency Card Flow ============
  async verifyTravelMoneyCardHeading() {
    await expect(
      this.page.getByRole('heading', { name: 'Travel Money Card' })
    ).toBeVisible();
  }

  async selectCurrencyPassCardOption(option: string) {
    await Promise.all([
      this.page.waitForLoadState('load'),
      this.page.locator(`//*[@id="${option}"]/span[2]`).click(),
    ]);
  }

  async clickNextButtonForCurrencyPassCard() {
    const nextButtonCurrencyPassCard = this.page
      .getByRole('button', { name: 'Next' })
      .last();
    await expect(nextButtonCurrencyPassCard).toBeEnabled();
    await nextButtonCurrencyPassCard.click();
  }

  async verifyPersonalisedCardHeading() {
    await expect(
      this.page.getByRole('heading', { name: 'Your personalised card' })
    ).toBeVisible();
  }

  async clickNextButtonForPersonalisedCard() {
    const nextButtonPersonalisedCard = this.page
      .getByRole('button', { name: 'Next' })
      .last();
    await expect(nextButtonPersonalisedCard).toBeEnabled();
    await nextButtonPersonalisedCard.click();
  }

  // ============ Email Flow ============
  async verifyEmailHeader() {
    const emailHeader = this.page.getByRole('heading', {
      name: "What's your email?",
    });
    await emailHeader.isVisible();
  }

  async generateRandomEmail(): Promise<string> {
    const now = new Date();

    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return `tmoztestdev+aw${timestamp}@gmail.com`;
  }

  async fillEmailFieldNewCash(email: string) {
    const emailInput = this.page.locator('input[name="email"]');
    await emailInput.fill(email);
  }

  async fillEmailFieldNewCard(email: string) {
    const emailInput = this.page.locator('input[name="email"]');
    await emailInput.fill(email);
  }

  // ============ Payment Flow ============
  async selectCreditCard() {
    await this.page.locator('//*[@id="Credit Card"]').click();
  }

  async fillCardNumber(cardNumber: string) {
    const cardNumberField = this.page
      .locator('iframe[title="Iframe for card number"]')
      .contentFrame()
      .getByRole('textbox', { name: 'Card number' });
    await cardNumberField.fill(cardNumber);
  }

  async fillCardExpiryDate(expiryDate: string) {
    const cardExpiryDate = this.page
      .locator('iframe[title="Iframe for expiry date"]')
      .contentFrame()
      .getByRole('textbox', { name: 'Expiry date' });
    await cardExpiryDate.fill(expiryDate);
  }

  async fillSecurityCode(securityCode: string) {
    const securityCodeField = this.page
      .locator('iframe[title="Iframe for security code"]')
      .contentFrame()
      .getByRole('textbox', { name: 'Security code' });
    await securityCodeField.fill(securityCode);
  }

  async fillNameOnCard(name: string) {
    await this.page
      .getByRole('textbox', { name: 'Name on card' })
      .fill(name);
  }

  async generateRandomCardholderName(): Promise<string> {
    const randomCardName = Math.random()
      .toString(36)
      .substring(2, 8);
    const capitalized = randomCardName
      .charAt(0)
      .toUpperCase() + randomCardName.slice(1);
    return `Test ${capitalized}`;
  }

  async acceptCardFeeDialog() {
    try {
      const feesDialog = this.page
        .locator('[role="dialog"]')
        .filter({ hasText: /let's talk fees/i })
        .first();

      await feesDialog.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});

      if (await feesDialog.isVisible({ timeout: 5000 }).catch(() => false)) {
        const checkbox = feesDialog.locator('[role="checkbox"]').first();
        const consentText = feesDialog.getByText(/i understand and wish to proceed/i).first();

        if (await checkbox.count()) {
          await checkbox.scrollIntoViewIfNeeded();
          await checkbox.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
          await checkbox.click({ force: true }).catch(() => consentText.click({ force: true }));
          await this.page.waitForTimeout(500);
        }

        const proceedButton = feesDialog.locator('button:has-text("Proceed")').first();
        if (await proceedButton.count()) {
          await expect(proceedButton).toBeEnabled({ timeout: 15000 });
          await proceedButton.click({ force: true });
        }

        await feesDialog.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
      }
    } catch (e) {
      console.log('Card fee dialog not found or already handled');
    }
  }

  async acceptTermsAndCompletePayment() {
    await this.page.mouse.click(10, 10);
    await this.page.keyboard.press('Tab');
    await this.page
      .locator('//*[@id="root"]/main/form/div[2]/div[2]/button')
      .click();
    await this.page
      .getByRole('button', { name: 'Purchase Currency' })
      .isEnabled();
    await this.page
      .getByRole('button', { name: 'Purchase Currency' })
      .click();
  }

  async clickAwayAndTabNavigation() {
    await this.page.mouse.click(10, 10);
    await this.page.keyboard.press('Tab');
  }

  // ============ Reload Amount ============
  async enterReloadAmount(amount: string) {
    await this.page
      .getByRole('textbox', { name: 'You pay' })
      .fill('');
    await this.page
      .getByRole('textbox', { name: 'You pay' })
      .fill(amount);
  }
}
