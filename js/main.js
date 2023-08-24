const API_KEY = '91d38c9e';
const searchInput = document.querySelector('.search-films__input');
const searchButton = document.querySelector('.search-films__button');
let pageNum;
let films = [];

//Функція помилки
const notFoundError = (data) => {
    const p = document.createElement('div');
    p.innerText = `${data.Error}`;
    p.classList.add('search-error');
    document.querySelector('.list-films').append(p);
}

//Очишення блоків
const deleteElements = (elementClassList) => {
    return  document.querySelector(elementClassList).innerHTML = '';
}

//Показ фільмів
const showMovie = (data) => {
    if (data.Response === 'False') {
        notFoundError(data);
    } else {
        data.Search.forEach((film) => {
            const divFilmDescription = document.createElement('div');
            divFilmDescription.classList.add('list-films__element');

            //Додаємо зображення
            const poster = document.createElement('img');
            if (film.Poster === 'N/A') {
                poster.src = '../assets/poster.jpg';
            } else {
                poster.src = `${film.Poster}`;
            }
            poster.alt = `Poster of "${film.Title}"`;

            const divFilmInfo = document.createElement('div');
            divFilmInfo.classList.add('list-films__info');

            const titleOfFilm = document.createElement('p');
            titleOfFilm.classList.add('list-films__description');
            titleOfFilm.innerText = `${film.Title}, ${film.Year}, ${film.Type}`
            divFilmInfo.append(titleOfFilm);

            const btnDetails = document.createElement('button');
            btnDetails.classList.add(`list-films__details`);
            btnDetails.innerText = `Details`;
            btnDetails.id = film.imdbID;

            //Невеличку інформацію групуємо у окремий блок
            divFilmDescription.append(poster, divFilmInfo, btnDetails);
            document.querySelector('.list-films').append(divFilmDescription);
        });
    }
}

//Запит данних та виведення їх
const getFilms = async () => {
    deleteElements('.list-films');
    deleteElements('.film-details');
    const filmName = searchInput.value;
    const URL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${filmName}&page=${pageNum}`;
    try {
        const filmList = await axios.get(URL);
        films = filmList.data;
        if (films.Response === "True") {
            showMovie(films);

            getPaginationNumbers(getPageCount(films.totalResults));

            document.querySelector('.list-films').addEventListener('click', function (event) {
                if (event.target.classList.contains('list-films__details')) {
                    let filmId = event.target.id;
                    getDetails(filmId);
                }
            })
        }
    } catch (error) {
        console.error(error);
    }
}

//Будуємо блок та показуємо детальну інформацію про фільм
const showDetails = (details) => {
    document.querySelector('.film-details').innerHTML = '';
    const filmPoster = document.createElement('img');
    if(details.Poster === 'N/A') {
        filmPoster.src = '../assets/poster.jpg';
    } else {
        filmPoster.src = `${details.Poster}`;
    }
    filmPoster.classList.add('film-details__poster');
    filmPoster.alt = `Poster of "${details.Title}"`;

    const title = document.createElement('p');
    title.innerHTML = `<span class="characteristic film-details__title">${details.Title} </span>`;
    const year = document.createElement('p');
    year.innerHTML = `<span class="characteristic"> Year: </span> ${details.Year}`;

    const country = document.createElement('p');
    country.innerHTML = `<span class="characteristic"> Country: </span> ${details.Country}`;

    const director = document.createElement('p');
    director.innerHTML = `<span class="characteristic"> Director: </span> ${details.Director}`;

    const writer = document.createElement('p');
    writer.innerHTML = `<span class="characteristic"> Writer: </span> ${details.Writer}`;

    const type = document.createElement('p');
    type.innerHTML = `<span class="characteristic"> Type: </span> ${details.Type}`;

    const genre = document.createElement('p');
    genre.innerHTML = `<span class="characteristic"> Genre: </span> ${details.Genre}`;

    const language = document.createElement('p');
    language.innerHTML = `<span class="characteristic"> Language: </span> ${details.Language}`;

    const released = document.createElement('p');
    released.innerHTML = `<span class="characteristic"> Released: </span> ${details.Released}`;

    const runtime = document.createElement('p');
    runtime.innerHTML = `<span class="characteristic"> Runtime: </span> ${details.Runtime}`;

    const actors = document.createElement('p');
    actors.innerHTML = `<span class="characteristic"> Actors: </span> ${details.Actors}`;

    const awards = document.createElement('p');
    awards.innerHTML = `<span class="characteristic"> Awards: </span> ${details.Awards}`;

    const plot = document.createElement('p');
    plot.innerHTML = `<span class="characteristic__plot"> <span class="characteristic"> Plot: </span><br> ${details.Plot} </span>`;

    const description = document.createElement('div');
    description.classList.add('film-details__content');
    description.append(title, year, country, director, writer, type, genre, language, released, runtime, actors, awards, plot);

    const divDetails =  document.querySelector('.film-details');
    divDetails.append(filmPoster, description);

    document.querySelector('.details__wrapper').append(divDetails);
}

const getDetails = async (filmId) => {
    deleteElements('.film-details');
    const URL = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${filmId}`;
    try {
        const filmDetails = await axios.get(URL);
        const film = filmDetails.data;
        if (film.Response === "True") {
            showDetails(film);
        }
    } catch (error) {
        console.error(error);
    }
}

searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        getFilms();
    }, {once: true}
);

//Додавання пагінації
const paginationNumbers = document.getElementById("pagination-numbers");
const paginationLimit = 10;

//Додаванняя кнопок пагінації
const appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.classList.add("pagination-number");
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);

    paginationNumbers.appendChild(pageNumber);
};

//Додавання кожного елементу на сторінку
const getPaginationNumbers = (pageCount) => {
    paginationNumbers.innerHTML = '';
    for (let i = 1; i <= pageCount; i++) {
        appendPageNumber(i);
    }
};

//Підрахунок усієї кількості сторінок
const getPageCount = (data) => {
    return Math.ceil(data / paginationLimit);
}

//Перехід на іншу сторінку
paginationNumbers.addEventListener('click', function(event) {
    pageNum = event.target.textContent;
    getFilms(filmName = this, pageNum = pageNum);
});