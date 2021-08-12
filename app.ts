// 변수명 - 소문자로 시작하는 카멜케이스
// 타이핑하는 식별자 - 대문자로 시작하는 카멜케이스

interface Store {
  currentPage: number;
  totalPage: number;
  feeds: NewsFeed[]; // newsFeed유형의 데이터가 들어가는 배열
}

interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

// 인터섹션(&) - 타입 알리아스의 기능
interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean; // 있을 때도 있고 없을 때도 있고
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}

interface RouteInfo {
  path: string;
  page: View
}

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"

// x: 폭 m: magin
// 타입알리아스, 인터페이스 기능
const store: Store = {
  currentPage: 1,
  totalPage: 0,
  feeds: [],
};

class Api {
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

class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>();
  }
}

class NewsDetailApi extends Api {
  getData(): NewsDetail {
    return this.getRequest<NewsDetail>();

  }
}

abstract class View {
  private template: string;
  private renderTemplate: string;
  private container: HTMLElement;
  private htmlList: string[];

  constructor(containerId: string, template: string) {
    const containerElement = document.getElementById(containerId);
    if (!containerElement) {
      throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.'
    }

    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  protected updateView(): void {
    // 배열에 있는 요소를 문자열로 합쳐줌.
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
  }
  protected addhtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }
  protected gethtml(): string {
    const snapshot = this.htmlList.join('');
    this.clearHtmlList();
    return snapshot;
  }
  protected setTemplateData(key: string, value: string): void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }
  protected clearHtmlList(): void {
    this.htmlList = [];
  }
  abstract render(): void; // 추상메소드 // 상속된 클래스에 한해 접근가능
}

class Router {
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
// class - 대문자로 시작하는 클래스명 컨벤션
class NewsFeedView extends View {
  private api: NewsFeedApi;
  private feeds: NewsFeed[];

  constructor(containerId: string) {
    let template = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>`;

    // 상위 클래스로부터 extends 해주면 반드시 상위클래스의 생성자를 명시적으로 호출해줘야 함 **
    super(containerId, template);
    this.api = new NewsFeedApi(NEWS_URL);
    // JSON -> Object  
    this.feeds = store.feeds;

    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.api.getData();      
      this.makeFeed();
    }
    // store.totalPage = this.feeds.length / 10;
  }

  render(): void {
    //store.currentPage = Number(location.hash.substring(7) || 1);
    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
      const { id, title, comments_count, user, points, time_ago, read } = this.feeds[i];
      this.addhtml(
        `
              <div class="p-6 ${read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
              <div class="flex">
                <div class="flex-auto">
                  <a href="#/show/${id}">${title}</a>  
                </div>
                <div class="text-center text-sm">
                  <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
                </div>
              </div>
              <div class="flex mt-3">
                <div class="grid grid-cols-3 text-sm text-gray-500">
                  <div><i class="fas fa-user mr-1"></i>${user}</div>
                  <div><i class="fas fa-heart mr-1"></i>${points}</div>
                  <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
                </div>  
              </div>
              </div>
          `);
    }
    this.setTemplateData('news_feed', this.gethtml());
    this.setTemplateData('prev_page', String(store.currentPage > 1 ? store.currentPage + 1 : store.currentPage));
    this.setTemplateData('next_page', String(store.currentPage + 1));

    this.updateView();
  }

  // 타입추론: 타입스크립트 컴파일러가 타입을 유추할 수 있는 것 
  private makeFeed(): void {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false
    }
  }
}

class NewsDetailView extends View {
  constructor(containerId: string) {

    let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/__currentPage__" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>{{__title__}}</h2>
        <div class="text-gray-400 h-20">
          {{__content__}}
        </div>
        {{__comments__}}
      </div>
    </div>
    `
    super(containerId, template);
  }

  render(): void {
    // 브라우저가 제공하는 location 
    const id = location.hash.substring(7);
    const api = new NewsDetailApi(CONTENT_URL.replace('@id', id));

    const newsDetail: NewsDetail = api.getData();
    const title = document.createElement('h1');

    for (let i = 0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
        break;
      }
    }
    this.setTemplateData('comments', this.makeComment(newsDetail.comments));
    this.setTemplateData('currentPage', String(store.currentPage));
    this.setTemplateData('title', String(newsDetail.title));
    this.setTemplateData('content', String(newsDetail.content));

    this.updateView();
  }

  private makeComment(comments: NewsComment[]): string {
    const commentString = [];

    for (let i = 0; i < comments.length; i++) {
      const comment: NewsComment = comments[i];
      this.addhtml(
        `<div style="padding-left: ${comment.level} * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>`);

      if (comment.comments.length > 0) {
        this.addhtml(this.makeComment(comment.comments));
      }
    }
    return this.gethtml();
  }
}
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