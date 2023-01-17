import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PixabayApi from './PixabayAPI';

const pixabayApi = new PixabayApi();
const simpleLightbox = new SimpleLightbox('.gallery a');

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const guard = document.querySelector('.guard');

const options = {
  root: null,
  rootMargin: '500px',
  threshhold: 0,
};
let observer = new IntersectionObserver(onLoad, options);

formRef.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();

  // loadingProgressBtn();
  const {
    searchQuery: { value: searchQuery },
  } = evt.currentTarget.elements;

  if (!searchQuery.trim()) {
    clearMarkup();
    observer.unobserve(guard);
    return;
  }

  pixabayApi.searchQueryWord = searchQuery.trim();
  pixabayApi.countPage = 1;

  clearMarkup();

  getImage();
}

async function getImage() {
  try {
    const {
      data: { hits: hits, totalHits: totalHits },
    } = await pixabayApi.fetchImage();

    const isNUllArr = hits.length === 0;
    const isFirstRequest = pixabayApi.paginationPage === 1;
    const x = Math.ceil(totalHits / pixabayApi.amountPerPage);
    const isObserver = pixabayApi.paginationPage < x;
    if (isNUllArr) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (isFirstRequest) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    markupPhotoCard(hits);
    scrolPage();

    if (isObserver) {
      observer.observe(guard);
    } else {
      if (!isFirstRequest) {
        observer.unobserve(guard);
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
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

  simpleLightbox.refresh();

  // loadingProgressBtn();
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      pixabayApi.countPage += 1;
      getImage();
    } else {
    }
  });
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

function clearMarkup() {
  galleryRef.innerHTML = '';
}
