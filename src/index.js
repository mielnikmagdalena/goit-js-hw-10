import axios from 'axios';
import SlimSelect from 'slim-select';
// Ustawienie nagłówka z kluczem API
axios.defaults.headers.common['x-api-key'] =
  'live_Azme2SGnu6hL9Sr8t6i2ko7AHTHcmkv2YFx2dLSlUrOohIiXyuSbZh3xe00pBDOH';

// Powiązanie elementów DOM
const breedSelect = document.querySelector('.breed-select');
const catInfoContainer = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

// Dodanie nasłuchiwania na zdarzenie zmiany dla select
breedSelect.addEventListener('change', handleBreedChange);

// Funkcja obsługująca zmianę rasy kota
function handleBreedChange(event) {
  const breedId = event.target.value;
  if (breedId) {
    showLoader();
    hideError();
    fetchCatInfo(breedId);
  } else {
    hideCatInfo();
  }
}

// Funkcja wyświetlająca animację ładowania
function showLoader() {
  loader.style.display = 'block';
}

// Funkcja ukrywająca animację ładowania
function hideLoader() {
  loader.style.display = 'none';
}
// Funkcja wyświetlająca komunikat o błędzie
function showError() {
  error.style.display = 'block';
}
// Funkcja ukrywająca komunikat o błędzie
function hideError() {
  error.style.display = 'none';
}

// Funkcja wykonująca żądanie informacji o kocie
function fetchCatInfo(breedId) {
  // Wykonaj żądanie HTTP, aby pobrać informacje o kocie na podstawie identyfikatora rasy
  axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      //console.log(response.data[0]);
      const catInfo = response.data[0];
      showCatInfo(catInfo);
    })
    .catch(error => {
      console.error(error);
      showError();
    })
    .finally(() => {
      hideLoader();
    });
}

// Funkcja wyświetlająca informacje o kocie
function showCatInfo(catInfo) {
  const { name, description, temperament } = catInfo.breeds[0];
  const { url } = catInfo;
  const catInfoHTML = `
    <div>
    <img  src="${url}" alt="">
      <h2>${name}</h2>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Temperament:</strong> ${temperament}</p>
    </div>
  `;

  catInfoContainer.innerHTML = catInfoHTML;
  catInfoContainer.style.display = 'block';
}

// Inicjalizacja aplikacji - pobranie listy ras kota
function initializeApp() {
  showLoader();
  axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      const breeds = response.data;
      fillBreedSelect(breeds);
    })
    .catch(error => {
      console.error(error);
      showError();
    })
    .finally(() => {
      hideLoader();
    });
}

// Funkcja wypełniająca select opcjami ras kotów
function fillBreedSelect(breeds) {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

// Inicjalizacja aplikacji po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});
