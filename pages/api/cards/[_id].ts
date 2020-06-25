import { MongoClient, ObjectID } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const dbURL = process.env.MONGODB_URL!;

	try {
		const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
		const db = client.db('cards');

		const { _id } = req.query;

		const card = await db
			.collection('cards')
			.find({ _id: new ObjectID(_id as string) })
			.next();

		res.status(200).json(card);

		client.close();
	} catch (err) {
		console.log(err);
		res.status(500).send('DB Failed to connect!');
	}
};
