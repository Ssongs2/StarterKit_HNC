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
  
      this.defaultRoute = null;
      this.routeTable = [];
    }

    setDefaultPage(page: View, params: RegExp | null = null): void {
      this.defaultRoute = { path: '', page, params };
    }
  
    addRouterPath(path: string, page: View, params: RegExp | null = null): void {
      this.routeTable.push({ path, page, params });
    }
   
    route() {
      const routePath:string = location.hash;

      if (routePath === '' && this.defaultRoute) {
        this.defaultRoute.page.render();
        return;
      }
  
      for(const routeInfo of this.routeTable) {
        if (routePath.indexOf(routeInfo.path) >= 0) {      
          if (routeInfo.params) {
            const parseParams = routePath.match(routeInfo.params);
            if (parseParams) {
              routeInfo.page.render.apply(null, [parseParams[1]]); // page가 view type인데 왜 render를 붙여야하는 거지?
            }          
          } else {
            routeInfo.page.render();
          }       
          return;
        }  
      }
    }
  }