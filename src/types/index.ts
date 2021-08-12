// 변수명 - 소문자로 시작하는 카멜케이스
// 타이핑하는 식별자 - 대문자로 시작하는 카멜케이스
import View from '../core/view';
export interface Store {
    currentPage: number;
    totalPage: number;
    feeds: NewsFeed[]; // newsFeed유형의 데이터가 들어가는 배열
  }
  
  export interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly title: string;
    readonly url: string;
    readonly user: string;
    readonly content: string;
  }
  
  // 인터섹션(&) - 타입 알리아스의 기능
  export interface NewsFeed extends News {
    readonly comments_count: number;
    readonly points: number;
    read?: boolean; // 있을 때도 있고 없을 때도 있고
  }
  
  export interface NewsDetail extends News {
    readonly comments: NewsComment[];
  }
  
  export interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
  }
  
  export interface RouteInfo {
    path: string;
    page: View
  }
  