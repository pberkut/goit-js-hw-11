import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import BSN from 'bootstrap.native';
import PixabayApi from './PixabayAPI';

// Reference
const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const guard = document.querySelector('.guard');

// Variables
const pixabayApi = new PixabayApi();
const options = {
  root: null,
  rootMargin: '500px',
  threshhold: 0,
};
let observer = new IntersectionObserver(onLoad, options);

formRef.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();

  const {
    searchQuery: { value: searchQuery },
  } = evt.currentTarget.elements;

  const isEmptyInput = searchQuery;

  if (!isEmptyInput) {
    clearMarkup();
    observer.unobserve(guard);
    return;
  }

  pixabayApi.searchQueryWord = searchQuery;
  pixabayApi.countPage = 1;
  observer.unobserve(guard);
  clearMarkup();
  getImage();
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      pixabayApi.countPage += 1;
      getImage();
    }
  });
}

async function getImage() {
  try {
    const { data } = await pixabayApi.fetchImage();
    const isNUllArr = data.hits.length === 0;
    const isNullTotalHits = data.hits.length < pixabayApi.perPage;
    if (isNUllArr) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      observer.unobserve(guard);
      return;
    }

    if (isNullTotalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      observer.unobserve(guard);
      return;
    }

    markupPhotoCard(data.hits);

    new SimpleLightbox('.gallery a');
    observer.observe(guard);
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function clearMarkup() {
  galleryRef.innerHTML = '';
}

function markupPhotoCard(arr) {
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
    
  <a class="link card-link" href="${largeImageURL}">
  <div class="photo-card">
  <div class="thumb">
  <img class="img" src="${webformatURL}" alt="${comments}" loading="lazy" />
  </div>
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
}
