import { categories } from '@/constants';
import { ObjectId } from 'mongodb';

interface TossupQuestion {
	id: number;
	text: string;
	answer: string;
	number: number;
	tournament_id: number;
	category_id: number;
	subcategory_id: number;
	round: string;
	created_at: string;
	updated_at: string;
	quinterest_id: number;
	formatted_text: string;
	formatted_answer: string;
	wikipedia_url: string | null;
	url: string;
	type: 'tossup';
	tournament: {
		id: number;
		year: number;
		name: string;
		address: string | null;
		quality: string | null;
		type: string | null;
		created_at: string;
		updated_at: string;
		difficulty: string;
		difficulty_num: number;
		url: string;
	};
	category: {
		id: number;
		name: string;
		created_at: string;
		updated_at: string;
		url: string;
	};
	subcategory: {
		id: number;
		name: string;
		created_at: string;
		updated_at: string;
		url: string;
	};
}

interface BonusQuestion {
	id: number;
	number: number;
	round: string;
	category_id: number;
	subcategory_id: number;
	quinterest_id: number | null;
	tournament_id: number;
	leadin: string;
	created_at: string;
	updated_at: string;
	texts: [string, string, string];
	answers: [string, string, string];
	formatted_texts: [string, string, string];
	formatted_answers: [string, string, string];
	wikipedia_urls: [string | null, string | null, string | null];
	url: string;
	type: 'bonus';
	tournament: {
		id: number;
		year: number;
		name: string;
		address: string;
		quality: string;
		type: null;
		link: string;
		type: string | null;
		link: string;
		created_at: string;
		updated_at: string;
		difficulty: string;
		difficulty_num: number;
		url: string;
	};
	category: {
		id: number;
		name: string;
		created_at: string;
		updated_at: string;
		url: string;
	};
	subcategory: {
		id: number;
		name: string;
		created_at: string;
		updated_at: string;
		url: string;
	};
}

interface QuizDBResponse {
	data: {
		num_tossups_found: number;
		num_tossups_shown: number;
		tossups: TossupQuestion[];
		num_bonuses_found: number;
		num_bonuses_shown: number;
		bonuses: BonusQuestion[];
	};
}

interface CardResponse {
	cards: ICard[];
	num_cards_found: number;
}

interface QuestionResponse {
	questions: TossupQuestion[];
	num_questions_found: number;
}

interface LeaderboardResponse {
	leaderboard: User[];
}

interface UsedQuestion {
	question: TossupQuestion;
	buzzLocation: number;
	hasPower: boolean;
	powerIndex: number;
	userAnswer: string;
}

interface ICard {
	hint: string;
	answer: string;
	subcategory: string | null;
	category: string;
	_id: string;
	author: string | null;
}

interface IProtoCard {
	hint: string;
	answer: string;
	category: string;
	subcategory: string | null;
	author: string | null;
}

interface User {
	name: string;
	score: number;
	_id: number;
}

interface UserWithoutScore {
	name: string;
	_id: number;
}

interface PartialUser {
	name?: string;
	_id?: number;
}

interface DBUser {
	name: string;
	score: number;
	_id: ObjectId;
}

interface QuestionRequestConfig {
	categories: (keyof typeof categories)[];
	limit: number;
	internal: boolean;
	subcategories: string[];
	difficulties: number[];
}

interface CardRequestConfig {
	categories: string[];
	subcategories: string[];
	limit?: number;
}

type AppMode = 'read' | 'card';
type UIMode = 'protobowl' | 'tabled';
type Category =
	| 'Literature'
	| 'Science'
	| 'History'
	| 'Fine Arts'
	| 'Mythology'
	| 'Religion'
	| 'Geography'
	| 'Philosophy'
	| 'Current Events'
	| 'Social Science'
	| 'Trash';

type ImportCardReducerAction =
	| { type: 'SET'; cards: IProtoCard[] }
	| { type: 'CATEGORY'; i: number; category: string }
	| { type: 'SUBCATEGORY'; i: number; subcategory: string };

interface QuestionReaderMethods {
	endQuestion: () => void;
	performReset: () => void;
}

interface Settings {
	categories: string[];
	subcategories: string[];
	difficulties: number[];
	mode: AppMode;
	ui_mode: UIMode;
	useLimit: boolean;
	limit: number;
	speed: number;
	user: UserWithoutScore | null;
}

type SettingsAction =
	| { type: 'LOAD'; settings: Settings }
	| { type: 'TOGGLE_CATEGORY'; category: string }
	| { type: 'TOGGLE_SUBCATEGORY'; subcategory: string }
	| { type: 'SET_MODE'; mode: AppMode }
	| { type: 'TOGGLE_DIFFICULTY'; difficulty: number }
	| { type: 'SET_LIMIT'; limit: number }
	| { type: 'SET_SPEED'; speed: number }
	| { type: 'SET_USE_LIMIT'; useLimit: boolean }
	| { type: 'SET_UI_MODE'; mode: UIMode }
	| { type: 'SET_USER'; user: PartialUser | null };

interface CreateUserPost {
	name: string;
}

interface CreateUserResponse {
	user: UserWithoutScore;
}

interface ScorePost {
	_id: number;
	type: 'TEN' | 'NEG' | 'POWER';
}
