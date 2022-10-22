const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIE_PER_PAGE = 12;

const movies = [];
// 儲存符合關鍵字的電影資料
let filteredMovies = [];
// 紀錄當前頁碼
let currentPage = 1;
// 每次讀取頁面時先取出local storage的資料，如果取到空值(false)變數得空陣列，若local storage有存資料則得字串(用JSON.parse轉回物件)
const favoriteList = JSON.parse(localStorage.getItem("favoriteMovie")) || [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const mode = document.querySelector(".mode");

// 目的 : 遍歷電影清單
function renderMovieList(data) {
  if (dataPanel.dataset.mode === "card-mode") {
    let rawHTML = "";
    data.forEach((item) => {
      rawHTML += `
        <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img src="${POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id
        }">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id
        }">+</button>
              </div>
            </div>
          </div>
        </div>
    `;
    });
    dataPanel.innerHTML = rawHTML;
  } else if (dataPanel.dataset.mode === "list-mode") {
    let rawHTML = '<ul class="list-group list-group-horizontal-xxl my-3">';
    data.forEach((item) => {
      rawHTML += `
        <li class="list-group-item d-flex justify-content-between">
        <h5>${item.title}</h5>
        <div>
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </li>
      `;
    });
    rawHTML += "</ul>";
    dataPanel.innerHTML = rawHTML;
  }
}

// 目的 : 重新整理後仍顯示加入收藏的電影
function showFavoriteIcon(data) {
  if (!data || !data.length) return;
  const favoriteButton = document.querySelectorAll(".btn-add-favorite");
  favoriteButton.forEach((btn) => {
    const movieSome = favoriteList.some(
      (movie) => movie.id === Number(btn.dataset.id)
    );
    if (movieSome) {
      btn.classList.add("btn-danger");
      btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }
  });
}

// 目的 : 遍歷paginator頁數
function renderPaginator(amount) {
  // 傳入的參數 : 傳入電影數量才知道總共要分幾頁
  // 80 / 12 = 6 ... 8 -> 7 無條件進位(.ceil)
  const numberOfPage = Math.ceil(amount / MOVIE_PER_PAGE);
  let rawHTML = "";

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `;
  }

  paginator.innerHTML = rawHTML;
}

// 目的 : 每頁顯示的電影，如果input page 1，顯示page 1應顯示的電影
function getMovieByPage(page) {
  // 如果filteredMovies裡有資料，回傳filteredMovies，如果沒有，回傳movies
  const data = filteredMovies.length ? filteredMovies : movies;

  const startIndex = (page - 1) * MOVIE_PER_PAGE;
  const endIndex = startIndex + MOVIE_PER_PAGE;

  return data.slice(startIndex, endIndex);
}

// 目的 : 顯示active page
function activePage(page) {
  const pageLink = document.querySelectorAll(".page-link");
  pageLink.forEach((link) => {
    const parentElement = link.parentElement;
    // 先移除active
    if (parentElement.classList.contains("active")) {
      parentElement.classList.remove("active");
    }
    // 如果當前page === <a>的data-page，加上active
    if (Number(link.dataset.page) === page) {
      parentElement.classList.add("active");
    }
  });
}

// 目的 : 更改並顯示movie modal
function showMovieModal(id) {
  const movieTitle = document.querySelector("#movie-modal-title");
  const movieImage = document.querySelector("#movie-modal-image");
  const movieDate = document.querySelector("#movie-modal-date");
  const movieDescription = document.querySelector("#movie-modal-description");
  // 串接另一個API，取得詳細資料title image release_date description
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    movieTitle.innerText = data.title;
    movieImage.innerHTML = `
        <img
          src="${POSTER_URL + data.image}"
          alt="movie-poster" class="img-fluid" />
      `;
    movieDate.innerText = "Release Date: " + data.release_date;
    movieDescription.innerText = data.description;
  });
}

// 目的 : 將收藏電影存到local storage
function addToFavorite(id) {
  // 用find在movies中遍歷，找出和點擊的電影相同的id，暫存在變數中
  const favoriteMovie = movies.find((movie) => movie.id === id);

  // 錯誤處理
  if (favoriteList.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  }

  // 把電影推進最愛清單
  favoriteList.push(favoriteMovie);
  // 把最愛清單的資料存到local storage
  localStorage.setItem("favoriteMovie", JSON.stringify(favoriteList));
}

// 目的 : change data-mode
function changeMode(mode) {
  if (dataPanel.dataset.mode === mode) return;
  dataPanel.dataset.mode = mode;
}

// 設置監聽器 : 切換mode
mode.addEventListener("click", function onModeClick(event) {
  if (event.target.tagName !== "I") return;
  if (event.target.id === "card-button") {
    changeMode("card-mode");
  } else if (event.target.id === "list-button") {
    changeMode("list-mode");
  }
  activePage(currentPage);
  renderMovieList(getMovieByPage(currentPage));
  showFavoriteIcon(getMovieByPage(currentPage));
});

// 設置監聽器 : click button
dataPanel.addEventListener("click", function onPanelClicked(event) {
  // 按more顯示movie modal
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  }

  // 按 + 加入我的最愛
  if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
    event.target.classList.add("btn-danger");
    event.target.innerHTML = '<i class="fa-solid fa-heart"></i>';
  }
});

// 設置監聽器 : click paginator
paginator.addEventListener("click", function onPaginatorClicked(event) {
  // 條件
  if (event.target.tagName !== "A") return;
  // 點擊到不同的page，get data-page，再渲染出每頁畫面
  currentPage = Number(event.target.dataset.page);

  activePage(currentPage);
  renderMovieList(getMovieByPage(currentPage));
  showFavoriteIcon(getMovieByPage(currentPage));
});

// 設置監聽器 : 按submit後搜尋電影
searchForm.addEventListener("submit", function onSearchFormSubmit(event) {
  // 移除瀏覽器自動刷新頁面的預設行為
  event.preventDefault();

  // 儲存關鍵字 : searchInput的值 - 去頭尾空白 - 字母小寫
  const keyword = searchInput.value.trim().toLowerCase();

  // filter迭代篩選條件 : 把title包含keyword的movies放進變數裡
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  searchInput.value = "";
  // 當前頁碼重置回第一頁
  currentPage = 1;
  // 重置分頁器
  renderPaginator(filteredMovies.length);
  activePage(currentPage);
  // 用filteredMovies的資料重新渲染頁面
  renderMovieList(getMovieByPage(currentPage));
  showFavoriteIcon(getMovieByPage(currentPage));

  //  錯誤處理 : 未輸入文字
  if (!keyword.length) {
    return alert("請輸入有效文字!");
  }

  // 錯誤處理 : 輸入錯誤關鍵字
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字${keyword}查無符合條件的電影，請重新輸入`);
  }
});

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);

    renderPaginator(movies.length);
    activePage(currentPage);
    renderMovieList(getMovieByPage(currentPage));
    showFavoriteIcon(getMovieByPage(currentPage));
  })
  .catch((error) => console.log(error));
