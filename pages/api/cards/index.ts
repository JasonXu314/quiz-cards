import { MongoClient, ObjectID } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
				const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
				const db = client.db('cards');
				
				const categories = [];
				if (typeof req.query.categories === 'string') {
					categories.push(...req.query.categories.split(/,\s?/));
				}
				else {
					res.status(400).send('Categories should be a single string of comma-separated categories');
					return;
				}

				const subcategories = [];
				if (typeof req.query.subcategories === 'string') {
					subcategories.push(...req.query.subcategories.split(/,\s?/));
				}
				else if (typeof req.query.subcategories !== 'undefined') {
					res.status(400).send('Subcategories should be a single string of comma-separated subcategories');
				}

				let limit: number;
				if (typeof req.query.limit === 'string') {
					limit = parseInt(req.query.limit);
				}
				else if (typeof req.query.limit !== 'undefined') {
					res.status(400).send('Limit must be a single integer value');
				}


				let cards = await db.collection('cards').find({
					$or: [
						...categories.map((category) => subcategories.filter((subcategory) => subcategory.startsWith(category)).length > 0 ?  ({
							$or: [
								...subcategories.filter((subcategory) => subcategory.startsWith(category)).map((subcategory) => ({ subcategory })),
							]
						}) : ({ category }))
					]
				}).toArray();
				if (req.query.limit) {
					const start = Math.floor(Math.random() * (cards.length - limit));
					cards = cards.slice(start, start + limit);
				}

				res.status(200).json(cards);
			}
			catch (err) {
				console.log(err);
				res.status(500).send('DB Failed to Connect');
			}
			return;
		case ('PUT'):
			try {
				const { card }= req.body;

				const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
				const db = client.db('cards');

				await db.collection('cards').findOneAndReplace({ _id: new ObjectID(card._id) }, { ...card, _id: new ObjectID(card._id) });
				res.status(200).send('Card Updated!');
			}
			catch (err) {
				console.log(err);
				res.status(500).send('DB Failed to Connect');
			}
		default:
			res.status(405).end();
			return;
	}
};