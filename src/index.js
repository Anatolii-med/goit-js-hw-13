import './sass/main.scss';
import resultCard from './templates/resultCard.hbs';
import NewsApiService from './JS/apifetch';
import Notiflix from 'notiflix';

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
      cleanCardContainer();

      if (!refs.moreBtn.hasAttribute('is-hidden')) {
        refs.moreBtn.classList.add('is-hidden');
      }
    } else {
      cleanCardContainer();
      Notiflix.Notify.info(`"Hooray! We found ${apiAnswer.totalHits} images."`);
      appendCardMarkup(apiAnswer.hits);
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
    console.log(newsApiService.perPage);

    // if (!(refs.gallery.querySelectorAll('.photo-card').length === apiAnswer.totalHits)) {
    if (
      apiAnswer.totalHits - refs.gallery.querySelectorAll('.photo-card').length <=
      newsApiService.perPage
    ) {
      Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
      refs.moreBtn.classList.add('is-hidden');
    } else {
      appendCardMarkup(apiAnswer.hits);
    }
  } catch (error) {
    console.log(error);
  }
}

function appendCardMarkup(ev) {
  refs.gallery.insertAdjacentHTML('beforeend', resultCard(ev));
}

function cleanCardContainer() {
  refs.gallery.innerHTML = '';
}
