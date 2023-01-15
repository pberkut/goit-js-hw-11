import Notiflix from 'notiflix';
import axios from 'axios';

// console.dir(axios);

getImage();

function getImage() {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '32766360-76e7eba189222bd8a15da9e43';
  const apiUrl = `${BASE_URL}?key=${API_KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true`;
  axios
    .get(apiUrl)
    .then(({ data }) => {
      console.dir(data);
    })
    .catch(console.log);
}
