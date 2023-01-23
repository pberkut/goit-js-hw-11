import Notiflix from 'notiflix';

import { refs } from './refs';
import { PixabayAPI } from './pixabay-api-service';
import { spinnerPlay, spinnerStop } from './spinner';
import { markupGalleryCards, clearMarkup } from './create-markup';

const pixabayAPI = new PixabayAPI();

const options = {
  root: null,
  rootMargin: '500px',
  threshhold: 0,
};
let observer = new IntersectionObserver(onLoad, options);

refs.form.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();

  const {
    searchQuery: { value: searchQuery },
  } = evt.currentTarget.elements;
  const searchQueryWord = searchQuery.trim();

  if (!searchQueryWord) {
    clearMarkup();
    observer.unobserve(refs.guard);
    return;
  }

  pixabayAPI.searchQuery = searchQueryWord;
  pixabayAPI.resetPaginationPage();
  observer.unobserve(refs.guard);
  clearMarkup();
  getImage();
}

async function getImage() {
  try {
    spinnerPlay();
    const {
      data: { hits: hits, totalHits: totalHits },
    } = await pixabayAPI.fetchImage();

    spinnerStop();
    const hasResult = hits.length === 0;
    const isFirstRequest = pixabayAPI.paginationPage === 1;

    pixabayAPI.setTotalImage(totalHits);
    const hasMore = pixabayAPI.hasMoreImage();
    // debugger;
    if (hasMore) {
      observer.observe(refs.guard);
    } else {
      if (!isFirstRequest) {
        observer.unobserve(refs.guard);
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }

    if (hasResult) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      // debugger;
      return;
    }

    if (isFirstRequest) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    markupGalleryCards(hits);

    scrolPage();
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      pixabayAPI.incrementPaginationPage();
      getImage();
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
