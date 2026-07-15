import { test, expect } from '@playwright/test';
import { TravelMoneyPage } from '../pages/TravelMoneyPage';

test.setTimeout(120000); // 2 minutes

test('Reload Card Flow', async ({ page }) => {
  const travelMoneyPage = new TravelMoneyPage(page);

  await travelMoneyPage.navigateToAddFunds();
  await travelMoneyPage.clickLoginRegister();
  await travelMoneyPage.loginWithCredentials('tmoztestdev+aw260406090235@gmail.com', 'Passw0rd!');
  await travelMoneyPage.navigateToReloadCard();

  await travelMoneyPage.verifyLogoutLinkVisible();
  await travelMoneyPage.zoomOut();
  await travelMoneyPage.verifyHowMuchCurrencyHeading();

  await travelMoneyPage.selectRandomCurrencyReload();
  await travelMoneyPage.enterReloadAmount('149.55');
  await travelMoneyPage.clickNextButton();

  await travelMoneyPage.selectCreditCard();
  await travelMoneyPage.fillCardNumber('4917610000000000');
  await travelMoneyPage.fillCardExpiryDate('03/30');
  await travelMoneyPage.fillSecurityCode('737');
  const cardholderName = await travelMoneyPage.generateRandomCardholderName();
  await travelMoneyPage.fillNameOnCard(cardholderName);

  await travelMoneyPage.clickAwayAndTabNavigation();
  await travelMoneyPage.acceptCardFeeDialog();
  await travelMoneyPage.acceptTermsAndCompletePayment();

  const orderComplete = page.getByRole('heading', { name: /order complete/i });
  await expect(orderComplete).toBeVisible({ timeout: 60000 });
});
