import { AlertPortalPage } from './app.po';

describe('alert-portal App', () => {
  let page: AlertPortalPage;

  beforeEach(() => {
    page = new AlertPortalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
