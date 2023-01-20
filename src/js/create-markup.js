import { refs } from './refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const simpleLightbox = new SimpleLightbox('.gallery a');

function markupGalleryCards(arr) {
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
        return `<a class="link card-link" href="${largeImageURL}">
  <div class="photo-card">
  <div class="thumb">
  <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
</a>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  simpleLightbox.refresh();
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

export { markupGalleryCards, clearMarkup };
