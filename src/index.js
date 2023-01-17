import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PixabayApi from './PixabayAPI';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const guard = document.querySelector('.guard');

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
  loadingProgressBtn();
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
    const {
      data: { hits: hits, totalHits: totalHits },
    } = await pixabayApi.fetchImage();

    const isNUllArr = hits.length === 0;
    const isReachedImage = hits.length < pixabayApi.perPage;
    const isFirstRequest = pixabayApi.paginationPage === 1;

    if (isNUllArr) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      observer.unobserve(guard);
      return;
    }

    if (isReachedImage) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      observer.unobserve(guard);
      return;
    }

    if (isFirstRequest) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    markupPhotoCard(hits);
    observer.observe(guard);
    scrolPage();
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
  new SimpleLightbox('.gallery a');
  loadingProgressBtn();
}

function scrolPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 0.3,
    behavior: 'smooth',
  });
}

function loadingProgressBtn() {
  const spinnerBtn = document.querySelector('.spinner-btn');
  spinnerBtn.classList.toggle('spinner-border');
}
