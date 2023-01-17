import axios, { Axios } from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32766360-76e7eba189222bd8a15da9e43';

export default class PixabayApi {
  constructor() {
    this.paginationPage = 1;
    this.searchQueryWord = '';
    this.perPage = 40;
  }

  async fetchImage() {
    const queryParamURL = `key=${API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.paginationPage}`;

    return await axios.get(`${BASE_URL}?${queryParamURL}`);
  }

  get countPage() {
    return this.paginationPage;
  }

  set countPage(newCountPage) {
    this.paginationPage = newCountPage;
  }

  get searchQueryWord() {
    return this.query;
  }

  set searchQueryWord(newQueryWord) {
    this.query = newQueryWord;
  }

  get amountPerPage() {
    return this.perPage;
  }

  set amountPerPage(newPerPage) {
    this.perPage = newPerPage;
  }
}
