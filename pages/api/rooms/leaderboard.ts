import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse<LeaderboardResponse | string>): Promise<void> => {
	const dbURL = process.env.MONGODB_URL!;

	try {
		const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });

		switch (req.method) {
			case 'GET':
				const room = req.query.room;

				if (Array.isArray(room)) {
					res.status(400).send('Room must be a string');
					break;
				}

				try {
					const db = client.db('rooms');
					const foundRoom = await db.collection<IRoom>('rooms').findOne({ name: room });

					if (!foundRoom) {
						res.status(404).send(`Room with name ${room} does not exist`);
						break;
					}

					const roomId = foundRoom.id;
					const leaderboardEntry = await db.collection<ILeaderboard>('leaderboards').findOne({ roomId });

					if (!leaderboardEntry) {
						res.status(404).send(`Leaderboard for room ${room} does not exist`);
						break;
					}

					const leaderboard = leaderboardEntry.leaderboard.map((user) => ({
						...user,
						_id: user.id
					}));

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
