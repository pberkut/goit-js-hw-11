import Notiflix from 'notiflix';
import axios from 'axios';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');

// console.dir(axios);

formRef.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();

  const query = evt.currentTarget.elements.searchQuery.value;
  getImage(query);
}

function getImage(query) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '32766360-76e7eba189222bd8a15da9e43';
  const apiUrl = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;

  axios
    .get(apiUrl)
    .then(({ data }) => {
      markupPhotoCard(data.hits);
    })
    .catch(console.log);
}

function markupPhotoCard(arr) {
  const isNUllArr = arr.length < 0;
  if (isNUllArr) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <div class="photo-card">
  <img src="${webformatURL}" alt="${comments}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>
          `;
      }
    )
    .join('');

  galleryRef.innerHTML = markup;
}
