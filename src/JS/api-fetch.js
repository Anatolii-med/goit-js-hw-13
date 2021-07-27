import axios from 'axios';

export class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = '';
    this.perPage = 40;
  }

  async fetchArticles() {
    const url = `https://pixabay.com/api/?key=22642975-54ab0d01d9c1b1285598c5aff&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;
    const response = await axios.get(url);
    this.page += 1;
    return response.data;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
