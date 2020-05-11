import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const cards: Cards = JSON.parse(fs.readFileSync('./cards.json').toString());
	
	switch (req.method) {
		case ('POST'):
			// Handle POST later
			return;
		case ('GET'):
			if (!req.query.categories) {
				res.status(400).json('Must have category');
			}
			const categories = [];

			if (typeof req.query.categories === 'string') {
				categories.push(...req.query.categories.split(/,\s?/).map((category) => category.toLowerCase()));
			}
			else {
				res.status(400).json('Categories should be a single string of comma-separated categories');
			}
			
			const response: Card[] = [];

			categories.forEach((category) => {
				response.push(...cards[category]);
			});

			res.status(200).json(response);
			return;
		default:
			res.status(405).end();
			return;
	}
}