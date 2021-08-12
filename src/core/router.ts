import { RouteInfo } from '../types';
import View from './view'; // default는 이름을 마음대로 지어도되고, 브레이스 기호 불필요

export default class Router {
    routeTable: RouteInfo[];
    defaultRoute: RouteInfo | null;
  
    constructor() {
  
      // 해시 내용이 변경될 때 발생
      window.addEventListener('hashchange', this.route.bind(this));
      // this.route -> 브라우저 이벤트 시스템이 호출
      // this가 해당 메소드의 것을 알려줘야 해.
  
      this.routeTable = [];
      this.defaultRoute = null;
    }
  
    setDefaultPage(page: View): void {
      this.defaultRoute = { path: '', page };
    }
  
    addRouterPath(path: string, page: View): void {
      this.routeTable.push({ path, page });
    }
   
    route() {
      const routePath = location.hash;
  
      if (routePath === '' && this.defaultRoute) {
        this.defaultRoute.page.render()
      }
  
      for (const RouteInfo of this.routeTable) {
        if (routePath.indexOf(RouteInfo.path) >= 0) {
          RouteInfo.page.render();
          break;
        }
      }
    }
  }