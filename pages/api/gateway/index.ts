import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { DBUser, ScorePost } from 'types';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const dbURL = process.env.MONGODB_URL!;

	try {
		const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
		const pusher = new Pusher({
			appId: process.env.PUSHER_APP_ID!,
			key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
			secret: process.env.PUSHER_SECRET!,
			cluster: 'us2'
		});

		switch (req.method) {
			case 'POST':
				try {
					const { _id, type } = req.body as ScorePost;
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
					pusher.trigger('quiz-cards-main', 'SCORE_CHANGE', { userId: _id, type });
				} catch (err) {
					console.log(err);
					res.status(500).send('Error connecting to DB');
				}
				break;
			default:
				res.status(400).send('Method not supported');
				break;
		}

		client.close();
	} catch (err) {
		console.log(err);
		res.status(500).send('DB Failed to connect!');
	}
};
