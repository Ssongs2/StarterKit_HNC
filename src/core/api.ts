import { NewsFeed, NewsDetail} from '../types';

export class Api {
    ajax: XMLHttpRequest;
    url: string;
  
    constructor(url: string) {
      this.ajax = new XMLHttpRequest;
      this.url = url;
    }
  
    getRequest<AjaxResponse>(): AjaxResponse {
      this.ajax.open('GET', this.url, false); // 동기적으로 처리하겠다.
      this.ajax.send();
  
      return JSON.parse(this.ajax.response);
    }
  }
  
  // 의사코드 : 전체적으로 흐름만 알기 위해서 문법도 신경쓰지 않고 코딩하는 것
  // javascript 믹스인 
  // 믹스드인을 쓰는 이유
  // 1. 다중 상속 불가
  // 2. 엮는 관계를 코드로 명시해 줘야 함.
  function applyApiMixins(targetClass: any, baseClass: any[]): void {
    baseClass.forEach(baseClass => {
      Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
        const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);
  
        if (descriptor) {
          Object.defineProperty(targetClass.prototype, name, descriptor);
        }
      });
    });
  }
  
  export class NewsFeedApi extends Api {
    getData(): NewsFeed[] {
      return this.getRequest<NewsFeed[]>();
    }
  }
  
  export class NewsDetailApi extends Api {
    getData(): NewsDetail {
      return this.getRequest<NewsDetail>();
  
    }
  }