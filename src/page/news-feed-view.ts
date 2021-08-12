import View from '../core/view';
import { NewsFeedApi } from '../core/api';
import { NewsFeed } from '../types'
import { NEWS_URL } from '../config'

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


// class - 대문자로 시작하는 클래스명 컨벤션
export default class NewsFeedView extends View {
    private api: NewsFeedApi;
    private feeds: NewsFeed[];
  
    constructor(containerId: string) {
     
      // 상위 클래스로부터 extends 해주면 반드시 상위클래스의 생성자를 명시적으로 호출해줘야 함 **
      super(containerId, template);
      this.api = new NewsFeedApi(NEWS_URL);
      // JSON -> Object  
      this.feeds = window.store.feeds;
  
      if (this.feeds.length === 0) {
        this.feeds = window.store.feeds = this.api.getData();      
        this.makeFeed();
      }
      // window.store.totalPage = this.feeds.length / 10;
    }
  
    render(): void {
      //window.store.currentPage = Number(location.hash.substring(7) || 1);
      for (let i = (window.store.currentPage - 1) * 10; i < window.store.currentPage * 10; i++) {
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
      this.setTemplateData('prev_page', String(window.store.currentPage > 1 ? window.store.currentPage + 1 : window.store.currentPage));
      this.setTemplateData('next_page', String(window.store.currentPage + 1));
  
      this.updateView();
    }
  
    // 타입추론: 타입스크립트 컴파일러가 타입을 유추할 수 있는 것 
    private makeFeed(): void {
      for (let i = 0; i < this.feeds.length; i++) {
        this.feeds[i].read = false
      }
    }
  }
  