import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { LeaderboardResponse } from 'types';

export default async (req: NextApiRequest, res: NextApiResponse<LeaderboardResponse | string>): Promise<void> => {
	const dbURL =
		process.env.NODE_ENV === 'development'
			? 'mongodb://localhost:27017'
			: `mongodb+srv://Me:${process.env.MONGODB_PASSWORD}@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`;

	switch (req.method) {
		case 'GET':
			try {
				const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
				const db = client.db('cards');

				const leaderboard = await db.collection('leaderboard').find({}).toArray();
				res.status(200).json({ leaderboard });
			} catch (err) {
				console.log(err);
				res.status(500).send('DB Failed to Connect');
			}
			return;
		default:
			res.status(405).end();
			return;
	}
};
