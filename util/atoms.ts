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

export const someAnsweringState = atom({
	key: 'someAnswering',
	default: false
});

export const roomPrevQuestionsState = atom<UsedQuestion[]>({
	key: 'roomPrevQuestions',
	default: []
});
