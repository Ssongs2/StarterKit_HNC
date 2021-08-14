import { NewsFeed, NewsDetail} from '../types';

export class Api {
    xhr: XMLHttpRequest;
    url: string;
  
    constructor(url: string) {
      this.xhr = new XMLHttpRequest;
      this.url = url;
    }
  
    // getRequestWithXHR<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
    //   this.xhr.open('GET', this.url); // 동기적으로 처리하겠다.
    //   this.xhr.addEventListener('load', () => {
    //     cb(JSON.parse(this.xhr.response))
    //   })
    //   this. xhr.send();
    // }

    // getRequestWithPromise<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
    //   fetch(this.url)
    //     .then(response => response.json())
    //     .then()
    //     .catch(() => {
    //       console.error('데이터 오류')
    //     }) // fetch api를 호출해서 응답을 받으면 자동으로 JSON.Parse 작동 // 동기적이아닌 비동기적으로 작동
    // }

    // async라는 프리픽스를 붙여주면 비동기 함수
    // 리턴값으론 Promise 객체를 리턴하는 함수가 됨.
    // 기존의 AjaxResponse를 감싸줌
    // Promise를 반환하는 비동기 함수
    async request<AjaxResponse>(): Promise<AjaxResponse> {
      const response = await fetch(this.url); // await 라는 오퍼레이터를 붙여줌.
      return await response.json() as AjaxResponse; // promise 객체를 반환해야하기 때문에 awit를 붙여줘야 함.

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
    constructor(url: string){
      super(url);
    };
    async getData(): Promise<NewsFeed[]> {
      return this.request<NewsFeed[]>();
    }
  }
  
  export class NewsDetailApi extends Api {
    constructor(url: string){
      super(url);
    };

    async getData(): Promise<NewsDetail> {
      return this.request<NewsDetail>();
    }
  }