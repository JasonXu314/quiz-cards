declare interface Card {
	hint: string;
	answer: string;
	id: number;
}

declare interface Question {
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
	}
	category: {
		id: number;
		name: string;
		created_at: string;
		updated_at: string;
		url: string;
	}
	subcategory: {
		id: number;
		name: string;
		created_at: string;
		updated_at: string;
		url: string;
	}
}

declare interface Cards {
	literature: Card[];
	science: Card[];
	history: Card[];
	'fine arts': Card[];
	mythology: Card[];
	religion: Card[];
	geography: Card[];
	philosophy: Card[];
	'current events': Card[];
	'social science': Card[];
	trash: Card[];
	prevID: number;
}

declare interface QuestionRequestConfig {
	categories: string[];
	limit: number;
	internal: boolean;
	subcategories: string[];
	difficulty: number;
}

declare interface CardRequestConfig {
	categories: string[];
}

declare type AppMode = 'read' | 'card';