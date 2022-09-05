import { fetchPhoto } from './fetchPhoto';
import { Notify } from 'notiflix';


const searchForm = document.querySelector('#search-form');
const searchQuery = document.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let numberOfPicture = 0;
let currentPage = 0;
let totalHits = 0;


const searchPhotos = e => {
  e.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  loadMoreBtn.classList.remove('is-visible');
  renderSearchPhotos();
};


const renderSearchPhotos = async () => {
  try {
    const photos = await fetchPhoto(searchQuery.value, currentPage);
    if (photos.hits.length !== 0) {
      renderPhotoListItems(photos.hits, gallery, currentPage);
      
      if (currentPage >= 1) {
        loadMoreBtn.classList.add('is-visible');
      }
      currentPage += 1;
      totalHits = photos.totalHits;
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
    }
  } catch (error) {
    if (searchQuery.value.trim() !== '') {
      console.log(error.message);
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
    }
  }
};


function checkEndOfHits() {
  numberOfPicture = document.querySelectorAll('.photo-card');

  if (totalHits > numberOfPicture.length) {
    renderSearchPhotos();
  } else {
 
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.classList.remove('is-visible');
  }
}


function renderPhotoListItems(photos, wrapper, page) {
 
  const markup = photos
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `
      <div class="photo-card">
        <div class="photo-card__item">
          <a class="photo-card__link" href="${largeImageURL}">
            <img
              class="photo-card__image"
              src=${webformatURL}
              alt="${tags}"
              loading="lazy"
              >
            </a>
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
      `
    )
    .join('');
  wrapper.insertAdjacentHTML('beforeend', markup);
}


searchForm.addEventListener('submit', searchPhotos);
loadMoreBtn.addEventListener('click', checkEndOfHits);

