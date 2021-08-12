import Router from "./core/router";
import { Store } from "./types";
import { NewsFeedView, NewsDetailView } from './page';
   // x: 폭 m: magin
  // 타입알리아스, 인터페이스 기능
  const store: Store = {
    currentPage: 1,
    totalPage: 0,
    feeds: [],
  };
  
  // 전역 객체
declare global {
  interface Window {
    store: Store
  }
}
window.store = store;

  // 백틱 : 문자열로 만들 수 있음
  // 브라킷 대괄호
  // 브레이스 {} 중괄호
  
  const router: Router = new Router();
  const newsFeedView = new NewsFeedView('root');
  const newsDetailView = new NewsDetailView('root');
  
  router.setDefaultPage(newsFeedView);
  
  router.addRouterPath('/page/', newsFeedView);
  router.addRouterPath('/show/', newsDetailView);
  
  router.route();