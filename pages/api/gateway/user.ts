import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const dbURL = process.env.MONGODB_URL!;

	try {
		const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });

		switch (req.method) {
			case 'POST':
				try {
					const db = client.db('cards');

					const { name } = req.body;
					const createdUser = await db.collection<IUser>('leaderboard').insertOne({ name, id: uuid(), score: 0 });

					res.status(201).json({ user: createdUser.ops[0] });
					client.close();
				} catch (err) {
					console.log(err);
					res.status(500).send('Server error connecting to DB');
				}
				break;
			case 'PATCH':
				try {
					const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
					const db = client.db('cards');

					const { name, id } = req.body;
					await db.collection<IUser>('leaderboard').updateOne({ id }, { $set: { name: name } });

					res.status(200).send('Name updated!');
				} catch (err) {
					console.log(err);
					res.status(500).send('Server error connecting to DB');
				}
				break;
			default:
				res.status(400).json('Method not supported');
				break;
		}

		client.close();
	} catch (err) {
		console.log(err);
		res.status(500).send('DB Failed to connect');
	}
};
