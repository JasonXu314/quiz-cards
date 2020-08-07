import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { v4 as uuid } from 'uuid';

export default async (req: NextApiRequest, res: NextApiResponse<CreateUserResponse | string>): Promise<void> => {
	try {
		const client = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });
		const db = client.db('rooms');
		const pusher = new Pusher({
			key: 'fe3b8164d0dd3aff71b6',
			appId: '1026188',
			cluster: 'us2',
			secret: '5fa75bf9b0d4fcb17a99'
		});

		switch (req.method) {
			case 'POST':
				const createdUser = (await db.collection<IUser>('roomUsers').insertOne({ id: uuid(), name: req.body.name, score: 0 })).ops[0];

				res.status(200).json({ user: { ...createdUser, id: createdUser.id } });
				break;
			case 'PATCH':
				const { id, name }: { id: string; name: string } = req.body;

				await db.collection<IUser>('roomUsers').findOneAndUpdate({ id: id }, { $set: { name } });
				const leaderboards = (await db.collection<ILeaderboard>('leaderboards').find().toArray()).filter((lbd: ILeaderboard) =>
					lbd.leaderboard.some((user) => user.id === id)
				);
				leaderboards.forEach((lbd) => {
					db.collection<ILeaderboard>('leaderboards').findOneAndUpdate(
						{ roomId: lbd.roomId },
						{ $set: { leaderboard: lbd.leaderboard.map((user) => (user.id === id ? { ...user, name } : user)) } }
					);
				});

				pusher.trigger('quiz-cards-rooms', 'NAME_CHANGE', { userId: id, name });
				res.status(200).send('Name Updated');
				break;
			default:
				res.status(405).send('Method not Allowed');
				break;
		}

		client.close();
	} catch (err) {
		console.log(err);
		res.status(500).send('Error connecting to DB');
	}
};
