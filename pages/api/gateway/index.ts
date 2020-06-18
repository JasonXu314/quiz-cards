import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { DBUser, ScorePost } from 'types';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const dbURL =
		process.env.NODE_ENV === 'development'
			? 'mongodb://localhost:27017'
			: `mongodb+srv://Me:${process.env.MONGODB_PASSWORD}@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`;
	switch (req.method) {
		case 'POST':
			try {
				const { _id, type } = req.body as ScorePost;
				const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
				const db = client.db('cards');

				switch (type) {
					case 'POWER':
						await db.collection<DBUser>('leaderboard').updateOne({ _id: new ObjectId(_id) }, { $inc: { score: 15 } });
						res.status(200).end();
						break;
					case 'NEG':
						await db.collection<DBUser>('leaderboard').updateOne({ _id: new ObjectId(_id) }, { $inc: { score: -5 } });
						res.status(200).end();
						break;
					case 'TEN':
						await db.collection<DBUser>('leaderboard').updateOne({ _id: new ObjectId(_id) }, { $inc: { score: 10 } });
						res.status(200).end();
						break;
					default:
						res.status(400).send('Unrecognized point scoring type');
						break;
				}
			} catch (err) {
				console.log(err);
				res.status(500).json('Error connecting to DB');
			}
			break;
		default:
			res.status(400).json('Method not supported');
			return;
	}
};
