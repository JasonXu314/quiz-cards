import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { cwd } from 'process';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const cards: Cards = JSON.parse(fs.readFileSync(path.join(cwd(), 'cards.json')).toString());
	
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
				categories.push(...req.query.categories.split(/,\s?/));
			}
			else {
				res.status(400).json('Categories should be a single string of comma-separated categories');
			}
			
			const response: Card[] = cards.filter((card) => categories.includes(card.category));

			res.status(200).json(response);
			return;
		default:
			res.status(405).end();
			return;
	}
}