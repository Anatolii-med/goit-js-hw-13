import './sass/main.scss';
import resultCard from './templates/resultCard.hbs';
import NewsApiService from './js/api-fetch';
import Notiflix, { Loading } from 'notiflix';
import axios from 'axios';

const refs = {
  inputForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.searchBtn'),
  moreBtn: document.querySelector('.load-more'),
};

const newsApiService = new NewsApiService();

refs.inputForm.addEventListener('submit', onSearchBtnClick);
refs.moreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onSearchBtnClick(e) {
  e.preventDefault();
  newsApiService.resetPage();
  newsApiService.query = e.currentTarget.elements.searchQuery.value;

  try {
    const apiAnswer = await newsApiService.fetchArticles();

    if (newsApiService.query.trim() === '') {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      clearCardsCounteiner();
      if (!refs.moreBtn.hasAttribute('is-hidden')) {
        refs.moreBtn.classList.add('is-hidden');
      }
    } else {
      clearCardsCounteiner();
      Notiflix.Notify.info(`"Hooray! We found ${apiAnswer.totalHits} images."`);
      appendCardsMarkup(apiAnswer.hits);
      refs.moreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtnClick() {
  const apiAnswer = await newsApiService.fetchArticles();
  try {
    console.log(apiAnswer.totalHits);
    console.log(refs.gallery.querySelectorAll('.photo-card').length);
    // if (!(refs.gallery.querySelectorAll('.photo-card').length === apiAnswer.totalHits)) {
    if (!(refs.gallery.querySelectorAll('.photo-card').length === apiAnswer.totalHits)) {
      appendCardsMarkup(apiAnswer.hits);
    } else {
      Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
      refs.moreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

function appendCardsMarkup(ev) {
  refs.gallery.insertAdjacentHTML('beforeend', resultCard(ev));
}

function clearCardsCounteiner() {
  refs.gallery.innerHTML = '';
}
