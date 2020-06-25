import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { DBUser } from 'types';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const dbURL = process.env.MONGODB_URL!;

	try {
		const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
		const db = client.db('cards');
		const pusher = new Pusher({
			appId: process.env.PUSHER_APP_ID!,
			key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
			secret: process.env.PUSHER_SECRET!,
			cluster: 'us2'
		});

		switch (req.method) {
			case 'POST':
				try {
					const { name } = req.body;
					const createdUser = (await db.collection<DBUser>('leaderboard').insertOne({ name, score: 0, _id: ObjectId.createFromTime(Date.now()) })).ops[0];

					res.status(201).json({ user: { _id: createdUser._id, name: createdUser.name } });
					pusher.trigger('quiz-cards-main', 'CREATE_USER', { user: createdUser });
				} catch (err) {
					console.log(err);
					res.status(500).send('Server error connecting to DB');
				}
				break;
			case 'PATCH':
				try {
					const { name, _id } = req.body;
					await db.collection<DBUser>('leaderboard').updateOne({ _id: new ObjectId(_id) }, { $set: { name: name } });

					res.status(200).send('Name updated!');
					pusher.trigger('quiz-cards-main', 'NAME_CHANGE', { userId: _id, name });
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
