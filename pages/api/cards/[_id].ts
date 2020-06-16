import { MongoClient, ObjectID } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	const dbURL =
		process.env.NODE_ENV === 'development'
			? 'mongodb://localhost:27017'
			: `mongodb+srv://Me:${process.env.MONGODB_PASSWORD}@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`;
	const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
	const db = client.db('cards');

	const { _id } = req.query;

	const card = await db
		.collection('cards')
		.find({ _id: new ObjectID(_id as string) })
		.next();

	res.status(200).json(card);
};
