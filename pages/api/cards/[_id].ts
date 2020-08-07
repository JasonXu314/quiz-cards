import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse<ISingleCardResponse | string>): Promise<void> => {
	try {
		const client = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });
		const db = client.db('cards');

		const { id } = (req.query as unknown) as ICardQuery;

		const card = await db.collection<ICard>('cards').findOne({ id });

		if (!card) {
			res.status(404).send('Card Not Found');
		} else {
			res.status(200).json({ card });
		}

		client.close();
	} catch (err) {
		console.log(err);
		res.status(500).send('DB Failed to connect!');
	}
};
