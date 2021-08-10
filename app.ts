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

// 인터섹션 - 타입 알리아스의 기능
interface NewsFeed  extends News {
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

const container: HTMLElement | null = document.getElementById('root');
const ajax: XMLHttpRequest = new XMLHttpRequest(); //상수
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
  getRequest<AjaxResponse>(url: string): AjaxResponse {
    const ajax =new XMLHttpRequest();
    ajax.open('GET', url, false); // 동기적으로 처리하겠다.
    ajax.send();
  
    return JSON.parse(ajax.response);
  }
}
// 의사코드 : 전체적으로 흐름만 알기 위해서 문법도 신경쓰지 않고 코딩하는 것
// javascript 믹스인 
// 믹스드인을 쓰는 이유
// 1. 다중 상속 불가
// 2. 엮는 관계를 코드로 명시해 줘야 함.
function applyApiMixins(targetClass: any, baseClass: any[]): void{
  baseClass.forEach(baseClass => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);
      
      if (descriptor) {
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }            
    });
  });
}
class NewsFeedApi {
  getData(): NewsFeed[]{
    return this.getRequest<NewsFeed[]>(NEWS_URL);
  }
}

class NewsDetailApi {
  getData(id: string): NewsDetail {
    return this.getRequest<NewsDetail>(CONTENT_URL.replace('@id', id));

  }
}
applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

function newsDetail(): void {
  // 브라우저가 제공하는 location 
  const id = location.hash.substring(7);
  const api = new NewsDetailApi();

  const newsContent : NewsDetail = api.getData(id);
  const title = document.createElement('h1');

  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>
        {{__comments__}}
      </div>
    </div>
    `

  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }
  updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));
}

function makeComment(comments: NewsComment[]): string {
  const commentString = [];

  for (let i = 0; i < comments.length; i++) {
    const comment: NewsComment = comments[i];
    commentString.push(`
      <div style="padding-left: ${comment.level} * 40}px;" class="mt-4">
      <div class="text-gray-400">
        <i class="fa fa-sort-up mr-2"></i>
        <strong>${comment.user}</strong> ${comment.time_ago}
      </div>
      <p class="text-gray-700">${comment.content}</p>
    </div>  
      `);

    if (comment.comments.length > 0) {
      commentString.push(makeComment(comment.comments));
    }
  }
  return commentString.join('');
}

function updateView(html: string): void {
  // 배열에 있는 요소를 문자열로 합쳐줌.
  if (container != null) { container.innerHTML = html }
  else { console.log("최상위 컨테이너가 없어 UI표시 불가") };
}
// 타입추론: 타입스크립트 컴파일러가 타입을 유추할 수 있는 
function makeFeed(feeds: NewsFeed[]): NewsFeed[] {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false
  }
  return feeds;
}

function newsFeed(): void {
  const api = new NewsFeedApi();
  // JSON -> Object  
  let newsFeed = store.feeds;
  let newsList = [];
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

  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeed(api.getData());
  }
  store.totalPage = newsFeed.length / 10;

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(
      `
            <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
            <div class="flex">
              <div class="flex-auto">
                <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
              </div>
              <div class="text-center text-sm">
                <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
              </div>
            </div>
            <div class="flex mt-3">
              <div class="grid grid-cols-3 text-sm text-gray-500">
                <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
                <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
                <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
              </div>  
            </div>
            </div>
        `);
    // ul 자식들을 포함하는 방법
    //ul.appendChild(div.children[0]);
    //ul.appendChild(div.firstElementChild);
  }
  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage + 1 : store.currentPage));
  template = template.replace('{{__next_page__}}', String(store.currentPage + 1));

  updateView(template);
}
// 백틱 : 문자열로 만들 수 있음
// 브라킷 대괄호
// 브레이스 {} 중괄호
function router(): void {
  const routePath = location.hash;

  if (routePath === '') {
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail();
  }
}
router();

// 해시 내용이 변경될 때 발생
window.addEventListener('hashchange', router);
