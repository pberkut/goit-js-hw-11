const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32766360-76e7eba189222bd8a15da9e43';

export default class PixabayApi {
  constructor() {
    // this.query;
  }

  fetchImage(query) {
    const API_KEY = '';
    const queryParamURL = `key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;

    return fetch(
      `https://pixabay.com/api/?key=32766360-76e7eba189222bd8a15da9e43&q=cat&image_type=photo&orientation=horizontal&safesearch=true`
    ).then(r => {
      if (!r.ok) {
        throw new Error(r.statusText);
      }

      return r.json();
    });
  }
}
