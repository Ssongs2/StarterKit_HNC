import { News, NewsFeed, NewsStore } from "./types";

// NewsStore와 연결
// NewsStore를 확장해서 구체화했다. implements
export default class Store implements NewsStore {
    private feeds:NewsFeed[];
    private _currentPage: number;

    constructor(){
        this.feeds = [];
        this._currentPage = 1;
    }
    // 클래스 안 변수명과 동일하면 안됨. 
    // 그래서 주로 내부에서 쓰는 변수명 앞에 _ 표시
    get currentPage(){
        return this._currentPage;
    }

    set currentPage(page: number){
        this._currentPage = page;
    }

    get nextPage(): number {
        return this._currentPage +1;
    }

    get prevPage(): number {
        return this._currentPage > 1 ? this._currentPage-1: 1;
    }

    get numberOfFeed(): number {
        return this.feeds.length;
    }

    get hasFeeds(): boolean {
        return this.feeds.length > 0;
    }

    getAllFeeds(): NewsFeed[] {
      return this.feeds;  
    }

    getFeed(position: number): NewsFeed {
        return this.feeds[position];
    }

    // 스프레드 오퍼레이터
    setFeeds(feeds: NewsFeed[]) : void {
        console.log("feeds", feeds);
        this.feeds = feeds.map(feed => ({
            ...feed,
            read:false,
        }))
    }

    makeRead(id: number): void {
        const feed = this.feeds.find((feed: NewsFeed) => feed.id === id);
        if (feed) {
            feed.read = true;
        }
    }
}