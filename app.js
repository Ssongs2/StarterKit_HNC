// let ajax = new XMLHttpRequest(); // 변수
const container = document.getElementById('root');
const ajax = new XMLHttpRequest(); //상수
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"

function getData(url){

    ajax.open('GET', url, false); // 동기적으로 처리하겠다.
    ajax.send();

    return JSON.parse(ajax.response);
}

// JSON -> Object  
const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

// 해시 내용이 변경될 때 발생
window.addEventListener('hashchange', function(){
    //console.log ('해시가 변경 됨.');
    //console.log(location.hash);
    // location
    const id = location.hash.substring(1);

    const newsContent = getData(CONTENT_URL.replace('@id', id));
    const title = document.createElement('h1');

    title.innerHTML = newsContent.title;
    newsContent.title;
    
    content.appendChild(title);
    console.log(newsContent);
})

for (let i = 0; i < 10; i++) {
    const div = document.createElement('div');
    const li = document.createElement('li');
    const a = document.createElement('a');

    div.innerHTML = 
    `
    <li><a href="#${newsFeed[i].id}">${newsFeed[i].title} (${newsFeed[i].comments_count }</a></li>
    `;

    //a.addEventListener('click', function(){});

    // a.href = `#${newsFeed[i].id}`;
    // a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count })`;
    //li.appendChild(a)

    //ul.appendChild(div.children[0]);
    ul.appendChild(div.firstElementChild);
}

// 백틱 : 문자열로 만들 수 있음
// 브라킷 대괄호
// 브레이스 {} 중괄호
//document.getElementById('root').appendChild(ul);
//document.getElementById('root').appendChild(content);

container.appendChild(ul);
container.appendChild(content);