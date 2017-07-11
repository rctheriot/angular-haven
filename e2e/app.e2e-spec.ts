import { AngularHavenPage } from './app.po';

describe('angular-haven App', () => {
  let page: AngularHavenPage;

  beforeEach(() => {
    page = new AngularHavenPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
