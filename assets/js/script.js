// OMDb stuff
const OMDB_API_KEY = '1160f108';
const OMDB_URL = 'http://www.omdbapi.com';

// Watchmode stuff
const WATCHMODE_API_KEY = 'lRXZDQg46UX6Rtc0TC32jZ3ryc427Mmh14ChY3TH';
const WATCHMODE_URL = 'https://api.watchmode.com';

/**
 * Input group
 * @type {HTMLDivElement}
 */
let inputGroup = document.querySelector('.date-group');

/**
 * The three input fields
 * @type {HTMLInputElement[]}
 */
let inputFields = [...inputGroup.querySelectorAll('input')];

/**
 * Scrollable list of services
 * @type {HTMLDivElement}
 */
let servicesElement = document.getElementById('services');

/**
 * The movie "card"
 * @type {HTMLDivElement}
 */
let movieContainer = document.querySelector('.movie');

/**
 * Check if all the fields in the input group have been (legitamately) filled out
 */
function checkFields() {
	const allFieldsFilled = inputGroup.getElementsByClassName('filled').length;
	document.querySelector('button').disabled = !(allFieldsFilled === 3);
}

/**
 * Using the date entered, fetch a movie that was released the same year
 * Because of API limitations, we're only searching movies with the word "the"
 * This restriction was chosen because "the" is the most commenly used word in the English language
 *
 * Times this comment block used "the": 5
 */
async function requestMovie() {
	/**
	 * Predefine these variables for usage with API calls
	 * Recycling is good
	 */
	let response, data;

	movieContainer.classList.add('loading');

	// const OMDB_SEARCH = `${OMDB_URL}/?apikey=${OMDB_API_KEY}&t=the&y=${inputYear.value}&type=movie`;
	const OMDB_SEARCH = '/sample/1996.json';

	response = await fetch(OMDB_SEARCH); // `${OMDB_URL}/?apikey=${OMDB_API_KEY}&t=the&y=${inputYear.value}&type=movie`
	data = await response.json();

	const { Released, Title, Runtime, Poster, Rated, Ratings, Plot, Actors, imdbID } = data;

	movieContainer.querySelector('#poster').src = Poster;

	movieContainer.querySelector('#movie-title').innerHTML = /*html*/ `
		<div>${Title}</div>
		<div class="rating rounded border-4 text-4xl px-2 font-serif border-gray-100">${Rated}</div>
	`;

	movieContainer.querySelector('#release-date p').innerHTML = Released;
	movieContainer.querySelector('#rating p').innerHTML = Ratings[0]['Value'];
	movieContainer.querySelector('#runtime p').innerHTML = Runtime;
	movieContainer.querySelector('#starring p').innerHTML = Actors;
	movieContainer.querySelector('#plot').innerHTML = Plot;

	/**
	 * Pipe the previously fetched IMDb ID into the Watchmode API
	 * and get all services the given movie is still streaming on
	 */
	// const WATCHMODE_SEARCH = `${WATCHMODE_URL}/v1/search/?apiKey=${WATCHMODE_API_KEY}&search_field=imdb_id&search_value=${imdbID}`;

	// response = await fetch(WATCHMODE_SEARCH);
	// data = await response.json();

	if (!data.statusCode) {
		response = await fetch('/data/services.json');

		/**
		 * @type {object[]}
		 */
		const supportedServices = await response.json();

		// const watchmodeID = data.title_results[0].id;

		// const WATCHMODE_TITLE = `${WATCHMODE_URL}/v1/title/${watchmodeID}/sources/?apiKey=${WATCHMODE_API_KEY}&regions=US`;
		const WATCHMODE_TITLE = '/sample/the-rock.json';

		response = await fetch(WATCHMODE_TITLE);
		data = await response.json();

		let redirectLinks = {};

		data.forEach((source) => {
			const service = supportedServices.find((service) => service.id === source.source_id);

			if (service === undefined) {
				alert("Couldn't find that service, something is wrong");
			}

			if (!Object.keys(redirectLinks).includes(service.name)) {
				redirectLinks[service.name] = source.web_url;
			}
		});

		Object.entries(redirectLinks).forEach((entry) => {
			const [service, link] = entry;

			servicesElement.innerHTML += /*html*/ `
				<a class='redirect-link' href="${link}" target='_blank'>${service}</a>
			`;
		});
	} else {
		console.log(`Error fetching ${WATCHMODE_SEARCH || ''}`);
	}

	movieContainer.classList.remove('loading');
}

/**
 * Automates shifting focus to the next input field in line
 */
inputFields.forEach((input, i) => {
	input.parentElement.addEventListener('input', (event) => {
		event.preventDefault();

		if (event.target.value.length === event.target.getAttribute('max').length) {
			input.parentElement.classList.add('filled');
			if (event.target.value > event.target.max) {
				event.target.value = event.target.max;
			}

			if (i < 2) inputFields[i + 1].focus();
		} else {
			input.parentElement.classList.remove('filled');
		}

		checkFields();
	});
});

/**
 * If backspace is pressed in an empty input field, re-focus the previous one
 */
inputFields.forEach((input, i) => {
	input.addEventListener('keydown', (event) => {
		if (i && event.target.value === '' && event.key === 'Backspace') {
			inputFields[i - 1].focus();
		}
	});
});
