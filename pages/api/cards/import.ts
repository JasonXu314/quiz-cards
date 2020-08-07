import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	try {
		const client = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });

		switch (req.method) {
			case 'GET':
				res.setHeader('Location', '/cards');
				res.status(301).send('This is just a endpoint for importing anki decks. To get the cards, simply request /cards instead');
				break;
			case 'POST':
				try {
					const cards: IProtoCard[] = req.body.cards;
					const db = client.db('cards');

					await db.collection<ICard>('cards').insertMany(cards.map((card) => ({ ...card, id: uuid() })));
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
