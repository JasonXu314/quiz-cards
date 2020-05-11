import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	console.log(process.env.MONGODB_PASSWORD);
	const dbURL = process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017' : `mongodb+srv://Me:${process.env.MONGODB_PASSWORD}@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`;
	switch (req.method) {
		case ('POST'):
			try {
				const { category, subcategory, hint, answer } = req.body;
				const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
				const db = client.db('cards');
				
				await db.collection('cards').insertOne({
					category,
					hint,
					answer,
					subcategory: subcategory === '' ? null : subcategory
				});
				res.status(200).send('Card Created!');
			}
			catch (err) {
				console.log(err);
				res.status(500).send('Server Error: DB Failed to push');
			}
			
			return;
		case ('GET'):
			try {
				if (!req.query.categories) {
					res.status(400).send('Must have category');
					return;
				}
				const client = await MongoClient.connect(`mongodb+srv://Me:Xinyue123@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`, { useUnifiedTopology: true });
				const db = client.db('cards');
				const cards = await db.collection('cards').find({}).toArray();
				
				const categories = [];
	
				if (typeof req.query.categories === 'string') {
					categories.push(...req.query.categories.split(/,\s?/));
				}
				else {
					res.status(400).send('Categories should be a single string of comma-separated categories');
					return;
				}
				
				const response: Card[] = cards.filter((card) => categories.includes(card.category));
	
				res.status(200).json(response);
			}
			catch (err) {
				console.log(err);
				res.status(500).send('DB Failed to Connect');
			}
			return;
		default:
			res.status(405).end();
			return;
	}
}