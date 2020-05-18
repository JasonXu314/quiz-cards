import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const dbURL = process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017' : `mongodb+srv://Me:${process.env.MONGODB_PASSWORD}@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`;
	
	switch (req.method) {
		case ('GET'):
			res.status(301).send('This is just a endpoint for importing anki decks. To get the cards, simply request /cards instead');
			return;
		case ('POST'):
			try {
				const cards: ProtoCard[] = req.body.cards;
				const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
				const db = client.db('cards');
				
				await db.collection('cards').insertMany(cards.map((card) => ({ ...card, subcategory: card.subcategory === '' ? null : card.subcategory })));
				res.status(200).send('Cards Imported!');
			}
			catch (err) {
				console.log(err);
				res.status(500).send('Server Error: DB Failed to push');
			}
		default:
			res.status(405).end();
			return;
	}
};