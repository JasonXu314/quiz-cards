import { MongoClient, ObjectID } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';

export default async (req: NextApiRequest, res: NextApiResponse<ICardIndexResponse | string>): Promise<void> => {
	try {
		const client = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });

		switch (req.method) {
			case 'GET':
				try {
					if (!req.query.categories) {
						res.status(400).send('Must have category');
						return;
					}
					const db = client.db('cards');

					const categories: Category[] = [];
					if (typeof req.query.categories === 'string') {
						categories.push(...(req.query.categories.split(/,\s?/) as Category[]));
					} else {
						res.status(400).send('Categories should be a single string of comma-separated categories');
						return;
					}

					const subcategories: Subcategory[] = [];
					if (typeof req.query.subcategories === 'string') {
						subcategories.push(...(req.query.subcategories.split(/,\s?/) as Subcategory[]));
					} else if (typeof req.query.subcategories !== 'undefined') {
						res.status(400).send('Subcategories should be a single string of comma-separated subcategories');
					}

					let limit: number = 50;
					if (typeof req.query.limit === 'string') {
						limit = parseInt(req.query.limit);
					} else if (typeof req.query.limit !== 'undefined') {
						res.status(400).send('Limit must be a single integer value');
					}

					let cards = await db
						.collection('cards')
						.find<ICard>({
							$or: [
								...categories.map((category) =>
									subcategories.filter((subcategory) => subcategory.startsWith(category)).length > 0
										? {
												$or: [
													...subcategories
														.filter((subcategory) => subcategory.startsWith(category))
														.map((subcategory) => ({ subcategory }))
												]
										  }
										: { category }
								)
							]
						})
						.toArray();
					if (req.query.limit) {
						const start = Math.floor(Math.random() * (cards.length - limit));
						cards = cards.slice(start, start + limit);
					}

					res.status(200).json({ cards, num_cards_found: cards.length });
				} catch (err) {
					console.log(err);
					res.status(500).send('DB Failed to Connect');
				}
				break;
			case 'POST':
				try {
					const { category, subcategory, hint, answer, author } = req.body;
					const db = client.db('cards');

					await db.collection<ICard>('cards').insertOne({
						category,
						hint,
						answer,
						id: uuid(),
						author: author === '' ? null : author,
						subcategory: subcategory === '' ? null : subcategory
					});
					res.status(200).send('Card Created!');
				} catch (err) {
					console.log(err);
					res.status(500).send('Server Error: DB Failed to push');
				}
				break;
			case 'PUT':
				try {
					const { card } = req.body;
					const db = client.db('cards');

					await db.collection('cards').findOneAndReplace({ _id: new ObjectID(card._id) }, { ...card, _id: new ObjectID(card._id) });
					res.status(200).send('Card Updated!');
				} catch (err) {
					console.log(err);
					res.status(500).send('DB Failed to Connect');
				}
				break;
			case 'DELETE':
				try {
					const { id } = req.body;
					const db = client.db('cards');

					await db.collection<ICard>('cards').findOneAndDelete({ id });
					res.status(200).send('Card Deleted!');
				} catch (err) {
					console.log(err);
					res.status(500).send('DB Failed to Connect');
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
