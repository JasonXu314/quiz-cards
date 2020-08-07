import cookie from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSidePropsResult } from 'next';
import { toWords } from 'number-to-words';
import qs from 'qs';
import { compareTwoStrings } from 'string-similarity';
import { categories, subcategories } from './constants';

export function compileQuestionRequest(options: QuestionRequestConfig): string {
	if (options.internal) {
		const req = '/api/questions?';

		let categories = '&categories=';
		categories += options.categories.join(',');

		let subcategories = '&subcategories=';
		subcategories += options.subcategories.join(',');

		let difficulties = '&difficulties=';
		difficulties += options.difficulties.join(',');

		return req + categories + subcategories + difficulties + `&limit=${options.limit}`;
	} else {
		const queryString = qs.stringify(
			{
				search: {
					query: '',
					filters: {
						category: options.categories.map((category) => categories[category].id),
						subcategory: options.subcategories.map((subcategory) => subcategories[subcategory].id),
						difficulty: options.difficulties.map((difficulty) => difficultyMap[difficulty as Difficulty])
					},
					limit: true,
					random: options.limit
				}
			},
			{ arrayFormat: 'brackets' }
		);
		return `https://www.quizdb.org/api/random?${queryString}`;
	}
}

export function compileCardRequest(root: string, options: CardRequestConfig): string {
	const req = root + '?';

	let categories = 'categories=';
	options.categories.forEach((category, i) => {
		if (i === options.categories.length - 1) {
			categories += category;
		} else {
			categories += category + ',';
		}
	});

	let subcategories = '&subcategories=';
	options.subcategories.forEach((subcategory, i) => {
		if (i === options.subcategories.length - 1) {
			subcategories += subcategory;
		} else {
			subcategories += subcategory + ',';
		}
	});

	const limit = options.limit ? `&limit=${options.limit}` : '';

	return req + categories + subcategories + limit;
}

export async function processCards(text: string, category: Category, subcategory: Subcategory | null, author: string): Promise<IProtoCard[]> {
	return new Promise((resolve) => {
		const raw = text.split(/;?\n/);
		raw.pop();
		const cards = raw
			.map((card) => card.split('\t'))
			.map((pair) => ({
				author,
				category,
				subcategory,
				hint: pair[0],
				answer: cleanCard(pair[1])
			}));
		resolve(cards);
	});
}

export function checkAns(userAns: string, answer: string): boolean {
	let ans = answer.trim().toLowerCase();
	const user = userAns.trim().toLowerCase();

	if (user === '') {
		return false;
	}

	const matcher = /\s*(\[|\()(\w|\s|&|\.|\?|;|\/|"|,|“|”)+(\)|\])/;
	ans = ans.slice(0, ans.match(matcher)?.index || ans.length);
	const special = ans.slice(ans.match(matcher)?.index || ans.length).trim();
	console.log(ans);

	const answers = ans.split(/(\s|\[|\()or\s/);

	for (const option of answers) {
		if (
			option === user ||
			option.includes(user) ||
			user.includes(option) ||
			option.includes(
				user.replace(/(\+|-|\.|:)/g, (str) => {
					switch (str) {
						case '+':
							return 'plus';
						case '-':
							return 'minus';
						case '.':
							return 'dot';
						case ':':
							return 'colon';
						default:
							return str;
					}
				})
			) ||
			option.replace(/\d+/g, (sub) => toWords(parseInt(sub))).includes(user) ||
			user.replace(/\d+/g, (sub) => toWords(parseInt(sub))).includes(option)
		) {
			return true;
		}
		if (compareTwoStrings(option, user) >= 0.5) {
			return true;
		}
	}
	return false;
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

export function sort<T>(arr: T[], comparator: (e1: T, e2: T) => 0 | -1 | 1): T[] {
	return (function qs(lo, hi): T[] {
		if (lo < hi) {
			const splitIdx = partition(arr, lo, hi, comparator);
			return [...qs(lo, splitIdx), ...qs(splitIdx, hi)];
		}
		return [];
	})(0, arr.length - 1);
}

function partition<T>(arr: T[], lo: number, hi: number, comparator: (e1: T, e2: T) => 0 | -1 | 1): number {
	const pivot = arr[Math.floor((lo + hi) / 2)];
	let i = lo;
	let j = hi;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		while (comparator(arr[i], pivot) < 0) {
			i++;
		}
		while (comparator(arr[j], pivot) > 0) {
			j++;
		}
		if (i >= j) {
			return j;
		}
		const temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;

		i++;
		j--;
	}
}

export function parseCookies(req: IncomingMessage): Record<string, string> {
	return cookie.parse(req.headers.cookie || '');
}

export function redirect(res: ServerResponse, dest: string): GetServerSidePropsResult<{ redirect: true }> {
	res.writeHead(302, {
		Location: dest
	}).end();
	return {
		props: {
			redirect: true
		}
	};
}

export function capitalize(arr: string[]): string[] {
	return arr.map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1));
}

export function generateCategoryFromDistro(distro: Record<Category, number>): Category {
	const rand = Math.random() * 100;
	const litMin = 0;
	const sciMin = litMin + distro.Literature;
	const histMin = sciMin + distro.Science;
	const faMin = histMin + distro.History;
	const mythMin = faMin + distro['Fine Arts'];
	const relMin = mythMin + distro.Mythology;
	const geoMin = relMin + distro.Religion;
	const phiMin = geoMin + distro.Geography;
	const ceMin = phiMin + distro.Philosophy;
	const ssMin = ceMin + distro['Current Events'];
	const trashMin = ssMin + distro['Social Science'];
	let category: Category = 'Literature';

	if (rand > litMin) category = 'Literature';
	if (rand > sciMin) category = 'Science';
	if (rand > histMin) category = 'History';
	if (rand > faMin) category = 'Fine Arts';
	if (rand > mythMin) category = 'Mythology';
	if (rand > relMin) category = 'Religion';
	if (rand > geoMin) category = 'Geography';
	if (rand > phiMin) category = 'Philosophy';
	if (rand > ceMin) category = 'Current Events';
	if (rand > ssMin) category = 'Social Science';
	if (rand > trashMin) category = 'Trash';

	return category;
}

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

export const defaultDistro = {
	'Current Events': 2.5,
	'Fine Arts': 15,
	Geography: 5,
	History: 20,
	Literature: 20,
	Mythology: 5,
	Philosophy: 2.5,
	Religion: 2.5,
	Science: 20,
	'Social Science': 5,
	Trash: 2.5
} as const;
