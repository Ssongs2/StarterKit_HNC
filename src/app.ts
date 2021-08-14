import Store from "./store";
import Router from "./core/router";
import { NewsFeedView, NewsDetailView } from './page';
// x: 폭 m: magin
// 타입알리아스, 인터페이스 기능

// 백틱 : 문자열로 만들 수 있음
// 브라킷 대괄호
// 브레이스 {} 중괄호

const store = new Store();

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root', store);
const newsDetailView = new NewsDetailView('root', store);

// \/ Escape Character - /
// () grouping
// d+ d: digit +: 1 more of the preceding token 
router.setDefaultPage(newsFeedView);
router.addRouterPath('/page/', newsFeedView,/page\/(\d+)/);
router.addRouterPath('/show/', newsDetailView,/show\/(\d+)/);

router.route();