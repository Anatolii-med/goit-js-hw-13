import './sass/main.scss';
import resultCard from './templates/resultCard.hbs';

import axios from 'axios';
import Notiflix from 'notiflix';
// Notiflix.Notify.failure('Failure message text');

const refs = {
  inputForm: document.querySelector('.search-form'),
  input: document.querySelector('.searchQuery'),
  gallery: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.searchBtn'),
  moreBtn: document.querySelector('.load-more'),
};

const key = '22642975-54ab0d01d9c1b1285598c5aff';
const defaultURL = 'https://pixabay.com/api/';
// const happyMessage = `"Hooray! We found ${this.totalHits} images."`;
const oopsMessage = 'Sorry, there are no images matching your search query. Please try again.';

refs.inputForm.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';

  const inp = event.currentTarget.elements.searchQuery.value;

  if (inp.trim() === '') {
    addMessage('failure', oopsMessage);
    if (!refs.moreBtn.hasAttribute('is-hidden')) {
      refs.moreBtn.classList.add('is-hidden');
    }
  } else {
    await axios
      .get(
        `${defaultURL}?key=${key}&q=${inp}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`,
      )
      .then(photos => createGallery(photos));
  }
}

function createGallery({ data }) {
  const markup = resultCard(data.hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  if (data.totalHits === 0) {
    addMessage('info', `"Hooray! We found ${data.totalHits} images."`);
    console.log(0);
    if (!refs.moreBtn.hasAttribute('is-hidden')) {
      refs.moreBtn.classList.add('is-hidden');
    }
  } else {
    addMessage('info', `"Hooray! We found ${data.totalHits} images."`);
    refs.moreBtn.classList.remove('is-hidden');
  }
}

function addMessage(typeMessage, message) {
  Notiflix.Notify[typeMessage](message);
}
