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
  // -------- 초기 세팅 ----------- //
  let dataIndex = data['results']; // data 안에 있는 results [] 대괄호 묶음을 Index 변수에 담는다.

  // -------- 영화데이터 보여주기 ----------- //
  const cardList = document.querySelector('.list_area'); // document에서 클래스 list_area를 찾아 선택, 그것을 cardList 변수에 담는다.
  cardList.innerHTML = ""; // 해달 클래스안에 html 내용 초기화, 없애주기
  dataIndex.forEach((i) => { // i 는 index. 데이터모음집인 dataIndex에 있는 i번째 index 배열 요소 하나하나를 다 돈다.
    let myTitle = i['title']; // i 번째 인덱스 배열안에 요소 'title'을 변수에 담는다.
    let myOverView = i['overview'];
    let myPosterPath = i['poster_path'];
    let myVoteAverage = i['vote_average'];
    let myId = i['id'];

    // html에 넣어지는 템플릿 + 콘텐츠
    // 아래와 같은 html tag 추가해라
    let temp_html = `        
      <div data-id="${myId}" class="movieCard" >
        <img class="movieImage" src="${IMAGE_BASE_URL}${myPosterPath}" alt="">
        <div class="movieName">
          <h3>${myTitle}</h3>
          <p class="movieGrade">Rating :  ${myVoteAverage}</p>
        </div>
        <p class="movieExplanation">${myOverView}</p>

      </div>`;



    cardList.insertAdjacentHTML('beforeend', temp_html); //cardList 안에 콘텐츠 넣기(position, html).
  });


    // ------------- 영화 카드 클릭시 ID 보여주기 ----------- //

  const movieIdShowbyClick = function () {
      const movieCards = document.querySelectorAll(".movieCard");
      movieCards.forEach(card => {
        card.addEventListener("click", function () {
          let movieCardId = this.getAttribute("data-id");
          alert(`영화 ID : ${movieCardId}`);
        })
      })
  }
  movieIdShowbyClick(); 



  // -------- 영화 검색 ----------- //
  function movieSearch(event) {
    event.preventDefault(); // form tag 의 폼 제출 기본 동작 방지 : 이벤트가 발생했을 때 기본 동작 취소

    const searchInput = document.getElementById('search_input'); // 검색엔진input박스를 Id를 통해 찾아라(선택)
    const query = searchInput.value.toLowerCase(); // 검색엔진박스 안에 들어가는 value 값을 소문자로 변환한다. 이것을 왼쪽 변수에 담는다.
    searchInput.value = "";

    console.log(query);

    if (query.trim() === '') { // trim을 사용해 문자열 양 끝의 공백을 제거하고 원본 문자열을 수정하지 않고 새로운 문자열을 반환한다. 만약 그 반환값이 빈문자열이면 아래 alert 뜨게 해라
      alert('검색어를 입력해주세요');
      return;
    }

    // API 데이터를 배열로 가져오기
    let title_list = dataIndex.map((item) => { // data results 배열을 그대로 복사해 새로운 배열에 넣는다.
      return item.title.toLowerCase(); // 그리고 그 아이템들에서 영화제목을 소문자로 변환한다.
    });

    // query와 title_list 비교
    let find_title = title_list.filter((item) => {
      return item.includes(query);
    });

    // 전체title에서 title 인덱스번호 찾기
    let find_index = [];

    for (let i in find_title) {
      let idx = title_list.findIndex((item) => {
        return item === find_title[i];
      });
      find_index.push(idx);
    }

    // 만약 값이 없다면 -> alert
    if (find_index.length === 0) {
      alert('검색 결과가 없습니다.');
      // 값이 있으면 -> 전체 데이터에서 일치한 데이터 뽑아와서 리스트 만들기
    } else {
      const match_movie = [];
      for (let a of find_index) {
        const movies = dataIndex[a];
        match_movie.push(movies);
      }
      cardList.innerHTML = "";
      // alert("검색 결과 있음");
      // 채워넣기
      match_movie.forEach((result) => {
        const title = result['title'];
        const overview = result['overview'];
        const posterPath = result['poster_path'];
        const voteAverage = result['vote_average'];
        const id = result['id'];

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

        cardList.insertAdjacentHTML('beforeend', temp_html);
      });
    };

    movieIdShowbyClick(); 

  };
  // 검색 기능
  searchArea.addEventListener("submit", movieSearch);
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
                          
  
