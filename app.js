const container = document.getElementById('root');
const ajax = new XMLHttpRequest(); //상수
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"
// x: 폭 m: magin
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
    </div>
        `

const store = {
  currentPage: 1,
  totalPage: 0,
};

function getData(url) {

  ajax.open('GET', url, false); // 동기적으로 처리하겠다.
  ajax.send();

  return JSON.parse(ajax.response);
}
function newsDetail() {
  // 브라우저가 제공하는 location 
  const id = location.hash.substring(7);

  const newsContent = getData(CONTENT_URL.replace('@id', id));
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

    function makeComment(comments, called=0){
      const commentString = [];

      for(let i=0; i < comments.length; i++) {
        commentString.push(`
        <div style="padding-left: ${called * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comments[i].user}</strong> ${comments[i].time_ago}
        </div>
        <p class="text-gray-700">${comments[i].content}</p>
      </div>  
        `);

        if(comments[i].comments.length > 0){
          commentString.push(makeComment(comments[i].comments, called+1));
        }
      }
      return commentString.join('');
    }
  container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
}

function newsFeed() {
  // JSON -> Object  
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

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
        `
    );
    // ul 자식들을 포함하는 방법
    //ul.appendChild(div.children[0]);
    //ul.appendChild(div.firstElementChild);
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage + 1 : store.currentPage);
  template = template.replace('{{__next_page__}}', store.currentPage + 1);
  // 배열에 있는 요소를 문자열로 합쳐줌.
  container.innerHTML = template;
}
// 백틱 : 문자열로 만들 수 있음
// 브라킷 대괄호
// 브레이스 {} 중괄호
function router() {
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
