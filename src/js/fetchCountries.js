export { fetchCountries };
function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fiels=name,capital,population,flags.svg,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error('This countrie is not found');
    }
    return response.json();
  });
}
