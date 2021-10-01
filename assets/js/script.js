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
 * Destructure them for easier individual use
 */
let [inputMonth, inputDay, inputYear] = inputFields;

function Loader() {
	//
}

/**
 * Using the date entered, fetch a movie that was released the same year
 * Because of API limitations, we're only searching movies with the word "the"
 * This restriction was chosen because "the" is the most commenly used word in the English language
 *
 * Times this comment block used "the": 5
 */
function requestMovie() {
	/**
	 * For lack of both urgency and a better option, keep this in the code
	 */
	const API_KEY = '1160f108';

	// const URL = `http://www.omdbapi.com/?apikey=${API_KEY}&t=the&y=${inputYear.value}&type=movie`;

	const URL = '/sample/1996.json';

	fetch(URL)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		});
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

/**
 * Bring up the submit button once all fields are filled
 */
inputYear.addEventListener('input', (event) => {
	event.preventDefault();

	if (event.target.value.length === 4) {
		console.log('All fields filled');
	}
});
