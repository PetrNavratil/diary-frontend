import { DiaryFrontendPage } from './app.po';

describe('diary-frontend App', () => {
  let page: DiaryFrontendPage;

  beforeEach(() => {
    page = new DiaryFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
