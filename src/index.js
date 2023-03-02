import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const countryName = e.target.value.trim();
  if (!countryName) {
    cleanData(refs.countryInfo);
    cleanData(refs.countryList);
    return;
  }
  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      createMarkup(data);
    })
    .catch(error => {
      cleanData(refs.countryInfo);
      cleanData(refs.countryList);
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function cleanData(dataName) {
  dataName.innerHTML = '';
}

function createMarkup(data) {
  if (data.length === 1) {
    refs.countryInfo.innerHTML = createInfo(data);
    return;
  } else {
    refs.countryList.innerHTML = createList(data);
  }
}

function createInfo(data) {
  cleanData(refs.countryList);
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1 class="country-info__title"><img src="${flags.png}" alt="${
        name.official
      }" width="80" height="40">${name.official}</h1>
      <p class="country-info__description">Capital: ${capital}</p>
      <p class="country-info__description">Population: ${population}</p>
      <p class="country-info__description">Languages: ${Object.values(
        languages
      )}</p>`
  );
}

function createList(data) {
  cleanData(refs.countryInfo);
  return data
    .map(
      ({ name, flags }) =>
        `<li class="country-list__item"><img src="${flags.png}" alt="${name.official}" width="80" height="40"><span>${name.official}</span></li>`
    )
    .join('');
}
