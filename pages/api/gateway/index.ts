import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const dbURL = process.env.MONGODB_URL!;

	try {
		const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });

		switch (req.method) {
			case 'POST':
				try {
					const { id, type } = req.body as ScorePost;
					const db = client.db('cards');
					const $inc = { score: type === 'NEG' ? -5 : type === 'POWER' ? 15 : 10 };

					await db.collection<IUser>('leaderboard').updateOne({ id }, { $inc });
					res.status(200).end();
				} catch (err) {
					console.log(err);
					res.status(500).send('Error connecting to DB');
				}
				break;
			default:
				res.status(400).json('Method not supported');
				break;
		}

		client.close();
	} catch (err) {
		console.log(err);
		res.status(500).send('DB Failed to connect!');
	}
};
