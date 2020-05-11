import { compileCardRequest, compileQuestionRequest } from '../util/util';

it('compiles single category correctly (questions)', () => {
	const req = compileQuestionRequest('/api/questions', {
		categories: ['literature'],
		limit: 25
	});
	expect(req).toEqual('/api/questions?categories=literature&limit=25');
});

it('compiles single category correctly (cards)', () => {
	const req = compileCardRequest('/api/cards', {
		categories: ['literature']
	});
	expect(req).toEqual('/api/questions?cards=literature&');
});