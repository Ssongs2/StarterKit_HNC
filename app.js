// let ajax = new XMLHttpRequest(); // 변수

const ajax = new XMLHttpRequest(); //상수


ajax.open('GET', 'https://api.hnpwa.com/v0/news/1.json', false); // 동기적으로 처리하겠다.
ajax.send();

// JSON -> Object 

const newsFeed = JSON.parse(ajax.response);

for(let i=0; i<10; i++){
    
}

// 백틱 : 문자열로 만들 수 있음
// 브라킷 대괄호
// 브레이스 {} 중괄호

document.getElementById('root').innerHTML= `<ul>
    <li>${newsFeed[0].title}</li>
    <li>${newsFeed[1].title}</li>
    <li>${newsFeed[2].title}</li>
</ul>`;
