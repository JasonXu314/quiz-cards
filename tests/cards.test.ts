import axios from 'axios';
import cards from '../cards.json';

it('errors without category', () => {
	axios('https://localhost:5000/api/cards')
		.then(() => {
			fail('should have rejected');
		})
		.catch((err) => {
			expect(err).toHaveProperty('response');
		});
});

it('fetches cards properly', () => {
	axios('https://localhost:5000/api/cards?categories=literature')
		.then((res) => {
			expect(res.data).toEqual(cards.literature);
		})
		.catch((err) => {
			fail(err);
		})
});

it('fetches multiple categories properly', () => {
	axios('https://localhost:5000/api/cards?categories=literature,science')
		.then((res) => {
			expect(res.data).toEqual([...cards.literature, ...cards.science]);
		})
		.catch((err) => {
			fail(err);
		});
});