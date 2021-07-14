// let ajax = new XMLHttpRequest(); // 변수

const ajax = new XMLHttpRequest(); //상수
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"

ajax.open('GET', NEWS_URL, false); // 동기적으로 처리하겠다.
ajax.send();

// JSON -> Object 

const newsFeed = JSON.parse(ajax.response);
const ul = document.createElement('ul');

window.addEventListener('hashchange', function(){
    console.log ('해시가 변경 됨.');
    console.log(location.hash);
    const id = location.hash.substring(1);
    ajax.open('GET', CONTENT_URL.replace('@id', id), false);
    ajax.send();

    const newsContent = JSON.parse(ajax.response);
    console.log(newsContent)
})

for (let i = 0; i < 10; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = `#${newsFeed[i].id}`;
    a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count })`;

    //a.addEventListener('click', function(){});

    li.appendChild(a)
    ul.appendChild(li);
}

// 백틱 : 문자열로 만들 수 있음
// 브라킷 대괄호
// 브레이스 {} 중괄호
document.getElementById('root').appendChild(ul);