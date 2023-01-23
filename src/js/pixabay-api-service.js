import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '32766360-76e7eba189222bd8a15da9e43';
  #query = '';
  #perPage = 40;
  #paginationPage = 1;
  #totalImage = 0;

  async fetchImage() {
    return await axios.get(
      `${this.#BASE_URL}?key=${this.#API_KEY}&q=${
        this.#query
      }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${
        this.#perPage
      }&page=${this.#paginationPage}`
    );
  }

  setTotalImage(totalImage) {
    this.#totalImage = totalImage;
  }

  hasMoreImage() {
    return this.#paginationPage < Math.ceil(this.#totalImage / this.#perPage);
  }

  incrementPaginationPage() {
    this.#paginationPage += 1;
  }

  resetPaginationPage() {
    this.#paginationPage = 1;
  }

  get searchQuery() {
    return this.#query;
  }

  set searchQuery(newQuery) {
    this.#query = newQuery;
  }

  get paginationPage() {
    return this.#paginationPage;
  }
}
