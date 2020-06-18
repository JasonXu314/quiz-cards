import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { IProtoCard } from 'types';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const dbURL =
		process.env.NODE_ENV === 'development'
			? 'mongodb://localhost:27017'
			: `mongodb+srv://Me:${process.env.MONGODB_PASSWORD}@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`;

	try {
		const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });

		switch (req.method) {
			case 'GET':
				res.status(301).send('This is just a endpoint for importing anki decks. To get the cards, simply request /cards instead');
				break;
			case 'POST':
				try {
					const cards: IProtoCard[] = req.body.cards;
					const db = client.db('cards');

					await db.collection('cards').insertMany(cards.map((card) => ({ ...card, subcategory: card.subcategory === '' ? null : card.subcategory })));
					res.status(200).send('Cards Imported!');
				} catch (err) {
					console.log(err);
					res.status(500).send('Server Error: DB Failed to push');
				}
				break;
			default:
				res.status(405).end();
				break;
		}

		client.close();
	} catch (err) {
		console.log(err);
		res.status(500).send('DB Failed to connect!');
	}
};
