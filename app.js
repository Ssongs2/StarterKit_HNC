const container = document.getElementById('root');
const ajax = new XMLHttpRequest(); //상수
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"
// x: 폭 m: magin
let template = `
    <div class="container mx-auto p-4">
        <h1>Hacker News</h1>
        <ul>
        {{__news_feed__}}
            <li>
                <a></a>
            </li>
        </ul>
    <div>
    <a href="#/page>{{__prev_page__}}">이전 페이지</a>
    <a href="#/page/{{__next_page__}}">다음 페이지</a>
    </div>
</div>
    `

const store = {
    currentPage: 1,
    totalPage: 0,
};

function getData(url){

    ajax.open('GET', url, false); // 동기적으로 처리하겠다.
    ajax.send();

    return JSON.parse(ajax.response);
}
function newsDetail(){
    // 브라우저가 제공하는 location 
    const id = location.hash.substring(7);

    const newsContent = getData(CONTENT_URL.replace('@id', id));
    const title = document.createElement('h1');

    container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div><a href="#/page/${store.currentPage}">목록으로</a></div>
    `;
}
function newsFeed() {
    // JSON -> Object  
    const newsFeed = getData(NEWS_URL);
    const newsList = [];

    store.totalPage = newsFeed.length/10;
    
    for (let i = (store.currentPage -1)*10; i < store.currentPage * 10; i++) {
        newsList.push(
        `
        <li>
            <a href="#/show/${newsFeed[i].id}">
               ${newsFeed[i].title} (${newsFeed[i].comments_count })
            </a>
        </li> 
        `
        );
        // ul 자식들을 포함하는 방법
        //ul.appendChild(div.children[0]);
        //ul.appendChild(div.firstElementChild);
    }

    template = template.replace('{{__news_feed__}}', newsList.join(''));
    template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage +1: store.currentPage);
    template = template.replace('{{__next_page__}}', store.currentPage + 1);
    // 배열에 있는 요소를 문자열로 합쳐줌.
    container.innerHTML = template;
}
// 백틱 : 문자열로 만들 수 있음
// 브라킷 대괄호
// 브레이스 {} 중괄호
function router() {
    const routePath = location.hash;

    if(routePath === ''){
        newsFeed();
    } else if(routePath.indexOf('#/page/') >= 0){
        store.currentPage = Number(routePath.substr(7));
        newsFeed();
    } else{
        newsDetail();
    }
}

router();

// 해시 내용이 변경될 때 발생
window.addEventListener('hashchange', router);
