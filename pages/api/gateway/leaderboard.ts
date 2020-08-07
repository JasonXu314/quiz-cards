import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse<LeaderboardResponse | string>): Promise<void> => {
	const dbURL = process.env.MONGODB_URL!;

	try {
		const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });

		switch (req.method) {
			case 'GET':
				try {
					const db = client.db('cards');

					const leaderboard = await db.collection('leaderboard').find({}).toArray();
					res.status(200).json({ leaderboard });
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
