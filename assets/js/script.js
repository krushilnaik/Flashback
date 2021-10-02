/**
 * Grab the three input fields
 * @type {HTMLInputElement[]}
 */
let inputFields = [
	document.getElementById('month'),
	document.getElementById('day'),
	document.getElementById('year')
];

/**
 * The movie "card"
 * @type {HTMLDivElement}
 */
let movieContainer = document.querySelector('.movie');

/**
 * Destructure them for easier individual use
 */
let [inputMonth, inputDay, inputYear] = inputFields;

/**
 * Using the date entered, fetch a movie that was released the same year
 * Because of API limitations, we're only searching movies with the word "the"
 * This restriction was chosen because "the" is the most commenly used word in the English language
 *
 * Times this comment block used "the": 5
 */
async function requestMovie() {
	/**
	 * For lack of both urgency and a better option, keep these in the code
	 */
	const OMDB_API_KEY = '1160f108';
	const OMDB_URL = 'http://www.omdbapi.com';

	const WATCHMODE_API_KEY = 'lRXZDQg46UX6Rtc0TC32jZ3ryc427Mmh14ChY3TH';
	const WATCHMODE_URL = 'https://api.watchmode.com';

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

	const { Released, Title, Runtime, Poster, Ratings, Plot, Actors, imdbID } = data;

	movieContainer.querySelector('img').src = Poster;
	movieContainer.querySelector('#movie-title').innerHTML = Title;
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
		// const watchmodeID = data.title_results[0].id;

		// const WATCHMODE_TITLE = `${WATCHMODE_URL}/v1/title/${watchmodeID}/sources/?apiKey=${WATCHMODE_API_KEY}&regions=US`;
		const WATCHMODE_TITLE = '/sample/the-rock.json';

		response = await fetch(WATCHMODE_TITLE);
		data = await response.json();

		// do something with the data

		console.log(data);
	} else {
		console.log(`Error fetching ${WATCHMODE_SEARCH}`);
	}

	movieContainer.classList.remove('loading');
}

/**
 * This automates shifting focus to the next input field in line
 * Also plays a neat progress/breadcrumb animation
 */
[inputMonth, inputDay].forEach((input, i) => {
	input.parentElement.addEventListener('input', (event) => {
		event.preventDefault();

		if (event.target.value.length === 2) {
			input.parentElement.classList.add('filled');
			if (event.target.value > event.target.max) {
				event.target.value = event.target.max;
			}
			inputFields[i + 1].focus();
		} else {
			input.parentElement.classList.remove('filled');
		}
	});
});

/**
 * If backspace is pressed in an empty input field, re-focus the previous one
 */
inputFields.forEach((input, i) => {
	input.addEventListener('keydown', (event) => {
		if (event.target.value === '' && event.key === 'Backspace') {
			inputFields[i - 1].focus();
		}
	});
});
