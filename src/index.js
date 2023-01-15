import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import BSN from 'bootstrap.native';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');

// console.dir(axios);

//
// var myButtonINIT = new BSN.Button('#myButton');
// myButtonINIT();
//
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
  console.log(arr);
  const isNUllArr = arr.length === 0;
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
       
     <a class="link link-secondary" href="${largeImageURL}">
     <div class="photo-card class="p-3"">
  <img class="img" src="${webformatURL}" alt="${comments}" loading="lazy" />
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
</a>

          `;
      }
    )
    .join('');

  galleryRef.insertAdjacentHTML('beforeend', markup);

  let gallery = new SimpleLightbox('.gallery a');
}
