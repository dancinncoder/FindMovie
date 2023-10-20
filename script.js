const searchArea = document.querySelector('.search_area');
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500/";
const movieCard = document.querySelector(".movieCard");
const movieImage = document.querySelector(".movieImage");
const searchInput = document.getElementById("search_input")
    .addEventListener("keyup", function(e) {
        if (e.code === 'Enter') {
            document.getElementById("submit").click();
        }
    });

// --------------TMDB API: API request and get ----------------- //


const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjI5M2EzNGQ5YTdhYmE3ZmE2YjA1MmVkNDBhNzAzNSIsInN1YiI6IjY1MmY3YTM2MDI0ZWM4MDEwMTU0MzQ3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4UlNrO-aIaz-15g60eboaP-Zr-ck8iYXpu1qfhKZm0E'
  }
};

const API_url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1"; // url이 길기때문에 변수안에 넣어줌


function fetchSecondThen(data) {
  // ---------- 초기 세팅 ----------- //
  let dataIndex = data['results']; // 우리가 앞으로 쓸 영화데이터 = 데이터(data)의 안에 있는 results 값 :result는 [ { "keyname" : "value", "keyname" : [ 배열 value ] } ] 형태로 묶여있다.

  // ----------- 영화데이터 보여주기 ----------- //
  const cardList = document.querySelector('.list_area'); // 받아온 데이터를 넣어줄 공간
  cardList.innerHTML = ""; // 받아온 데이터를 넣어줄 공간 안에 html 내용 초기화
  dataIndex.forEach((i) => { // i 는 index. 영화데이터 묶음에 있는 모든 요소를 돈다.
    let myTitle = i['title']; // i번째 인덱스, 객체안에 요소 'title'
    let myOverView = i['overview'];
    let myPosterPath = i['poster_path'];
    let myVoteAverage = i['vote_average'];
    let myId = i['id'];
    // html에 넣어지는 tag + 콘텐츠
    let temp_html = `        
      <div data-id="${myId}" class="movieCard" >
        <img class="movieImage" src="${IMAGE_BASE_URL}${myPosterPath}" alt="">
        <div class="movieName">
          <h3>${myTitle}</h3>
          <p class="movieGrade">Rating :  ${myVoteAverage}</p>
        </div>
        <p class="movieExplanation">${myOverView}</p>

      </div>`;
    cardList.insertAdjacentHTML('beforeend', temp_html); // temp_html을 데이터 넣어줄 공간안에서 마지막 자식 이후에 위치시키기
  });


    // ------------- 영화 카드 클릭시 ID 보여주기 ----------- //

  const movieIdShowbyClick = function () {
      const movieCards = document.querySelectorAll(".movieCard"); // 영화카드 모두 찾아 선택
      movieCards.forEach(card => {  // 영화카드들의 배열을 한번씩 모두 함수에 대입
        card.addEventListener("click", function () {  // "이벤트명", 함수 이하의 동작을 하는 이벤트 등록
          let movieCardId = this.getAttribute("data-id"); // 영화카드클래스 안에 속성 data-id 값
          alert(`영화 ID : ${movieCardId}`); // 영화 data id 값 alert
        })
      })
  }
  movieIdShowbyClick(); // 실행



  // -------- 영화 검색 ----------- //
  function movieSearch(event) {  // 영화검색기능
    event.preventDefault(); // submit 되는 동시에 창 새로고침을 방지

    const searchInput = document.getElementById('search_input'); // 검색엔진박스
    const query = searchInput.value.toLowerCase(); // 검색엔진박스 내 value 값을 소문자로 변환
    searchInput.value = ""; // 검색엔진박스 기본 value값은 빈문자열

    console.log(query);

    if (query.trim() === '') { // a문자열 양 끝의 공백을 제거 -> 소문자로변환된 value값이 빈문자열이면 
      alert('검색어를 입력해주세요'); // 아래 alert 뜨게 해라
      return; // 리턴은 함수를 즉시 빠져 나오는 기능
    }

    // API 데이터를 배열로 가져오기
    let title_list = dataIndex.map((item) => { // 영화데이터 배열을 그대로 복사해 새로운 배열에 넣는다.
      return item.title.toLowerCase(); // 그리고 그 아이템들에서 영화제목을 소문자로 변환한다.
    });

    // query와 title_list 비교
    let find_title = title_list.filter((item) => { // 소문자로변환된 검색엔진박스 내 value값 vs API 데이터에서 뽑아서 소문자로 변환한 영화제목 값 비교
      return item.includes(query); // api 데이터 영화제목에서 검색엔진 입력값이 포함되어 있으면 함수에서 나오기
    });

    // 전체title에서 title 인덱스번호 찾기
    let find_index = []; // 찾은 영화 인덱스 정보 배열 새로 만들기

    for (let i in find_title) {  // 검색엔진 값으로 이루어진 배열 요소 하나씩 돌기
      let idx = title_list.findIndex((item) => {  // API에서 나온 영화제목 배열 요소와 검색엔진이 같은 값의 인덱스 정보 값
        return item === find_title[i]; // 이면 빠져나오기
      });
      find_index.push(idx); // 찾은 영화 인덱스 정보 배열에 같은 값 추가
    }

    // 유효성 검사 : 만약 값이 없다면 -> alert
    if (find_index.length === 0) {  
      alert('검색 결과가 없습니다.');
    // 값이 있으면 -> 전체 데이터에서 일치한 데이터 뽑아와서 리스트 만들기
    } else {
      const match_movie = []; // 서로 값이 매치한 영화제목 배열 새로 만들기
      for (let a of find_index) {  // 값이 일치했던 영화제목 인덱스 배열을 돌면서
        const movies = dataIndex[a];  // 영화제목값
        match_movie.push(movies); // 매치한 영화제목 배열에 영화제목값을 넣는다
      }
      cardList.innerHTML = "";  // 데이터 정보를 넣어줄 공간을 비우기
      match_movie.forEach((result) => {  // 매치한 영화제목 배열을 하나씩 돌면서
        const title = result['title'];   
        const overview = result['overview'];
        const posterPath = result['poster_path'];
        const voteAverage = result['vote_average'];
        const id = result['id'];
        // 아래 내용을 넣어라
          const temp_html = `        
            <div data-id="${id}" class="movieCard" >
              <img class="movieImage" src="${IMAGE_BASE_URL}${posterPath}" alt="">
              <div class="movieName">
                <h3>${title}</h3>
                <p class="movieGrade">Rating :  ${voteAverage}</p>
              </div>
              <p class="movieExplanation">${overview}</p>

            </div>
            `;

        cardList.insertAdjacentHTML('beforeend', temp_html); // temp_html 데이터 정보를 넣어줄 공간안에서 마지막 자식 이후에 위치시키기
      });
    };

    movieIdShowbyClick(); // 검색 후에 나온 영화정보 카드를 클릭했을 때 ID 값 나오게하기

  };
  // 검색 기능
  searchArea.addEventListener("submit", movieSearch); // 검색엔진을 품고 있는 formtag에서 "submit"이 일어나면 오른쪽인자 함수를 실행시켜라
}





fetch(API_url, options) // API Data url을 통해
  .then(response => response.json()) // 약속이 이행되면 response 를 response 안에 json 형태로 데이터를 가져오기 
  .then(data => fetchSecondThen(data)) // 가져온 데이터를 아래처럼 실행하기 (적용)
  .catch(err => console.error(err));



// -------------- 페이지 홈으로 가기 ----------------- //
const goHomeBtn = document.getElementById('go_home_btn');
goHomeBtn.addEventListener('click', (event) => {
  window.location.href = 'index.html';
});

const refreshBtn = document.getElementById('refresh_icon');
refreshBtn.addEventListener('click', (event) => {
  window.location.href = 'index.html';
});

// -------------- 홈페이지 정보 alert ----------------- //

const infoBtn = document.getElementById('info_icon');
infoBtn.addEventListener('click', (event) => {
  window.alert('Welcome to FindMovie. I wish you have a great time searching for movies that you like to discover!');
});
                          
  
