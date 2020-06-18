import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { DBUser } from 'types';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const dbURL =
		process.env.NODE_ENV === 'development'
			? 'mongodb://localhost:27017'
			: `mongodb+srv://Me:${process.env.MONGODB_PASSWORD}@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`;
	switch (req.method) {
		case 'POST':
			try {
				const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
				const db = client.db('cards');

				const { name } = req.body;
				const createdUser = await db.collection<DBUser>('leaderboard').insertOne({ name, score: 0, _id: ObjectId.createFromTime(Date.now()) });

				res.status(201).json({ user: createdUser.ops[0] });
			} catch (err) {
				console.log(err);
				res.status(500).send('Server error connecting to DB');
			}
			break;
		case 'PATCH':
			try {
				const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
				const db = client.db('cards');

				const { name, _id } = req.body;
				await db.collection<DBUser>('leaderboard').updateOne({ _id: new ObjectId(_id) }, { $set: { name: name } });

				res.status(200).send('Name updated!');
			} catch (err) {
				console.log(err);
				res.status(500).send('Server error connecting to DB');
			}
			break;
		default:
			res.status(400).json('Method not supported');
			return;
	}
};
