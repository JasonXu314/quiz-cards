import qs from 'qs';

export function compileQuestionRequest(options: QuestionRequestConfig) {
	if (options.internal) {
		const req = '/api/questions?';
		
		let categories = '&categories=';
		options.categories.forEach((category, i) => {
			if (i === options.categories.length - 1) {
				categories += category;
			}
			else {
				categories += category + ',';
			}
		});

		let subcategories = '&subcategories=';
		options.subcategories.forEach((subcategory, i) => {
			if (i === options.subcategories.length - 1) {
				subcategories += subcategory;
			}
			else {
				subcategories += subcategory + ',';
			}
		});
	
		return req + categories + subcategories + `&limit=${options.limit}` + `&difficulty=${options.difficulty}`;
	}
	else {
		const queryString = qs.stringify({
			search: { 
				query: '',
				filters: {
					category: options.categories.map(convertCategory),
					subcategory: options.subcategories.map(convertSubcategory),
					difficulty: [difficultyMap[options.difficulty]]
				},
				limit: true,
				random: options.limit,
			}
		}, { arrayFormat: 'brackets' });
		return `https://www.quizdb.org/api/random?${queryString}`;
	}
}

export function compileCardRequest(root: string, options: CardRequestConfig) {
	const req = root + '?';
	
	let categories = 'categories=';
	options.categories.forEach((category, i) => {
		if (i === options.categories.length - 1) {
			categories += category;
		}
		else {
			categories += category + ',';
		}
	});

	let subcategories = '&subcategories=';
	options.subcategories.forEach((subcategory, i) => {
		if (i === options.subcategories.length - 1) {
			subcategories += subcategory;
		}
		else {
			subcategories += subcategory + ',';
		}
	})

	const limit = options.limit ? `&limit=${options.limit}` : '';

	return req + categories + subcategories + limit ;
}

export function convertCategory(category: string) {
	return categoryMap[category];
}

export function convertSubcategory(subcategory: string) {
	return subcategoryMap[subcategory];
}

export async function processCards(text: string, category: string, subcategory: string): Promise<ProtoCard[]> {
	return new Promise((resolve) => {
		const raw = text.split(/;?\n/);
		raw.pop();
		const cards = raw.map((card) => card.split('\t')).map((pair) => ({
			category,
			subcategory,
			hint: pair[0],
			answer: cleanCard(pair[1])
		}));
		resolve(cards);
	});
}

function cleanCard(card: string) {
	let newCard = card.replace(/"?<pre>Answer:<\/pre> /, '');

	if (newCard.includes('""')) {
		newCard = newCard.replace(/"$/, '');
		newCard = newCard.replace(/^"/, '');
		newCard = newCard.replace(/""/g, '"');
	}
	
	return newCard;
}

const categoryMap = {
	'Current Events': 26,
	'Fine Arts': 21,
	'Geography': 20,
	'History': 18,
	'Literature': 15,
	'Mythology': 14,
	'Philosophy': 25,
	'Religion': 19,
	'Science': 17,
	'Social Science': 22,
	'Trash': 16
} as const;

const subcategoryMap = {
	'Literature American': 4,
	'Literature British': 22,
	'Literature Classical': 30,
	'Literature European': 1,
	'Literature Other': 29,
	'Literature World': 12,
	'Science American': 36,
	'Science Biology': 14,
	'Science Chemistry': 5,
	'Science Computer Science': 23,
	'Science Math': 26,
	'Science Other': 10,
	'Science Physics': 18,
	'Science World': 37,
	'History American': 13,
	'History British': 6,
	'History Classical': 16,
	'History European': 24,
	'History Other': 28,
	'History World': 20,
	'Fine Arts American': 35,
	'Fine Arts Audiovisual': 27,
	'Fine Arts Auditory': 8,
	'Fine Arts British': 45,
	'Fine Arts European': 50,
	'Fine Arts Opera': 77,
	'Fine Arts Other': 25,
	'Fine Arts Visual': 2,
	'Fine Arts World': 43,
	'Mythology American': 33,
	'Mythology Chinese': 47,
	'Mythology Egyptian': 65,
	'Mythology Greco-Roman': 58,
	'Mythology Indian': 46,
	'Mythology Japanese': 48,
	'Mythology Norse': 63,
	'Mythology Other': 54,
	'Mythology Other East Asian': 49,
	'Religion American': 31,
	'Religion Christianity': 57,
	'Religion East Asian': 51,
	'Religion Islam': 68,
	'Religion Judaism': 69,
	'Religion Other': 62,
	'Geography American': 38,
	'Geography World': 44,
	'Philosophy American': 39,
	'Philosophy Classical': 61,
	'Philosophy East Asian': 52,
	'Philosophy European': 66,
	'Philosophy Other': 74,
	'Current Events American': 40,
	'Current Events Other': 42,
	'Social Science American': 34,
	'Social Science Anthropology': 76,
	'Social Science Economics': 56,
	'Social Science Linguistics': 75,
	'Social Science Other': 60,
	'Social Science Political Science': 64,
	'Social Science Psychology': 71,
	'Social Science Sociology': 73,
	'Trash American': 32,
	'Trash Movies': 72,
	'Trash Music': 67,
	'Trash Other': 59,
	'Trash Sports': 55,
	'Trash Television': 70,
	'Trash Video Games': 53
} as const;

const difficultyMap = {
	1: 'middle_school',
	2: 'easy_high_school',
	3: 'regular_high_school',
	4: 'hard_high_school',
	5: 'national_high_school',
	6: 'easy_college',
	7: 'regular_college',
	8: 'hard_college',
	9: 'open'
} as const;