const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovie')) || []

const dataPanel = document.querySelector('#data-panel')

// 目的 : 遍歷電影清單
function renderMovieList(data) { 
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
        <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
              </div>
            </div>
          </div>
        </div>
    `
  });
  dataPanel.innerHTML = rawHTML
}

// 目的 : 更改並顯示movie modal
function showMovieModal(id) {
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieImage = document.querySelector('#movie-modal-image')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDescription = document.querySelector('#movie-modal-description')
  // 串接另一個API，取得詳細資料title image release_date description
  axios.get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results
      movieTitle.innerText = data.title
      movieImage.innerHTML = `
        <img
          src="${POSTER_URL + data.image}"
          alt="movie-poster" class="img-fluid" />
      `
      movieDate.innerText = 'Release Date: ' + data.release_date
      movieDescription.innerText = data.description
    })
}

// 目的 : 刪除local storage資料
function removeFromFavorite(id){
  // 錯誤處理 : 如果movies是空值，或movie index不存在，則終止程式碼
  if (!movies || !movies.length) return
  
  // 找到刪除的電影的index
  const movieIndex = movies.findIndex((movie)=>movie.id === id)
  if (movieIndex === -1) return
  
  // 從陣列中移除
  movies.splice(movieIndex, 1)
  
  // 存回local storage
  localStorage.setItem('favoriteMovie', JSON.stringify(movies))
  
  // 重新渲染頁面(若沒有這步驟，則需要按重新整理才能顯示刪除後的畫面)
  renderMovieList(movies)
}

// 設置監聽器 : click
dataPanel.addEventListener('click', function onPanelClicked(event) {
  // 按more顯示movie modal
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))

    // 按 x 刪除我的最愛
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})


renderMovieList(movies)