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
	subcategory: Subcategory | null;
	category: Category;
	_id: string;
	author: string | null;
}

interface IProtoCard {
	hint: string;
	answer: string;
	category: Category;
	subcategory: Subcategory | null;
	author: string | null;
}

interface User {
	name: string;
	score: number;
	_id: string;
}

interface UserWithoutScore {
	name: string;
	_id: string;
}

interface PartialUser {
	name?: string;
	_id?: string;
}

interface DBUser {
	name: string;
	score: number;
	_id: ObjectId;
}

interface QuestionRequestConfig {
	categories: Category[];
	limit: number;
	internal: boolean;
	subcategories: Subcategory[];
	difficulties: Difficulty[];
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
type Subcategory =
	| 'Literature American'
	| 'Literature British'
	| 'Literature Classical'
	| 'Literature European'
	| 'Literature Other'
	| 'Literature World'
	| 'Science American'
	| 'Science Biology'
	| 'Science Chemistry'
	| 'Science Computer Science'
	| 'Science Math'
	| 'Science Other'
	| 'Science Physics'
	| 'Science World'
	| 'History American'
	| 'History British'
	| 'History Classical'
	| 'History European'
	| 'History Other'
	| 'History World'
	| 'Fine Arts American'
	| 'Fine Arts Audiovisual'
	| 'Fine Arts Auditory'
	| 'Fine Arts British'
	| 'Fine Arts European'
	| 'Fine Arts Opera'
	| 'Fine Arts Other'
	| 'Fine Arts Visual'
	| 'Fine Arts World'
	| 'Mythology American'
	| 'Mythology Chinese'
	| 'Mythology Egyptian'
	| 'Mythology Greco-Roman'
	| 'Mythology Indian'
	| 'Mythology Japanese'
	| 'Mythology Norse'
	| 'Mythology Other'
	| 'Mythology Other East Asian'
	| 'Religion American'
	| 'Religion Christianity'
	| 'Religion East Asian'
	| 'Religion Islam'
	| 'Religion Judaism'
	| 'Religion Other'
	| 'Geography American'
	| 'Geography World'
	| 'Philosophy American'
	| 'Philosophy Classical'
	| 'Philosophy East Asian'
	| 'Philosophy European'
	| 'Philosophy Other'
	| 'Current Events American'
	| 'Current Events Other'
	| 'Social Science American'
	| 'Social Science Anthropology'
	| 'Social Science Economics'
	| 'Social Science Linguistics'
	| 'Social Science Other'
	| 'Social Science Political Science'
	| 'Social Science Psychology'
	| 'Social Science Sociology'
	| 'Trash American'
	| 'Trash Movies'
	| 'Trash Music'
	| 'Trash Other'
	| 'Trash Sports'
	| 'Trash Television'
	| 'Trash Video Games';
type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type ScoreType = 'TEN' | 'NEG' | 'POWER';

type ImportCardReducerAction =
	| { type: 'SET'; cards: IProtoCard[] }
	| { type: 'CATEGORY'; i: number; category: Category }
	| { type: 'SUBCATEGORY'; i: number; subcategory: Subcategory };

interface QuestionReaderMethods {
	endQuestion: () => void;
	performReset: () => void;
}

interface Settings {
	categories: Category[];
	subcategories: Subcategory[];
	difficulties: Difficulty[];
	mode: AppMode;
	ui_mode: UIMode;
	useLimit: boolean;
	limit: number;
	speed: number;
	user: UserWithoutScore | null;
}

type SettingsAction =
	| { type: 'LOAD'; settings: Settings }
	| { type: 'TOGGLE_CATEGORY'; category: Category }
	| { type: 'TOGGLE_SUBCATEGORY'; subcategory: Subcategory }
	| { type: 'SET_MODE'; mode: AppMode }
	| { type: 'TOGGLE_DIFFICULTY'; difficulty: Difficulty }
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
	_id: string;
	type: ScoreType;
}

interface ScoreChangeEvent {
	userId: string;
	type: ScoreType;
}

interface NameChangeEvent {
	userId: string;
	name: string;
}

interface CreateUserEvent {
	user: User;
}
