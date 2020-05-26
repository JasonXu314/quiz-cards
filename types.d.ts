interface Question {
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
	type: 'tossup' | 'bonus';
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

interface UsedQuestion {
	question: Question;
	buzzLocation: number;
	hasPower: boolean;
	powerIndex: number;
	userAnswer: string;
}

interface Card {
	hint: string;
	answer: string;
	subcategory: string | null;
	category: string;
	_id: string;
}

interface ProtoCard {
	hint: string;
	answer: string;
	category: string;
	subcategory: strin | null;
}

interface QuestionRequestConfig {
	categories: string[];
	limit: number;
	internal: boolean;
	subcategories: string[];
	difficulty: number;
}

interface CardRequestConfig {
	categories: string[];
	subcategories: string[];
	limit?: number;
}

type AppMode = 'read' | 'card';

type ImportCardReducerAction =
	| { type: 'SET'; cards: ProtoCard[] }
	| { type: 'CATEGORY'; i: number; category: string }
	| { type: 'SUBCATEGORY'; i: number; subcategory: string };

interface QuestionReaderMethods {
	endQuestion: () => void;
	performReset: () => void;
}
