import { atom } from 'recoil';

export const answeringState = atom({
	key: 'answering',
	default: false
});

export const questionIndexState = atom({
	key: 'questionIndex',
	default: 0
});

export const usedQuestionsState = atom<UsedQuestion[]>({
	key: 'usedQuestions',
	default: []
});

export const readingStartState = atom({
	key: 'questionStart',
	default: false
});

export const activeState = atom({
	key: 'active',
	default: false
});
