import { defaultDistro } from '@/util';
import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { v4 as uuid } from 'uuid';

export default async (req: NextApiRequest, res: NextApiResponse<IRoomIndexResponse | ISingleRoomResponse | ICreateRoomResponse | string>): Promise<void> => {
	try {
		const client = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });
		const pusher = new Pusher({
			appId: process.env.PUSHER_ROOMS_APP_ID!,
			key: process.env.NEXT_PUBLIC_PUSHER_ROOMS_KEY!,
			secret: process.env.PUSHER_ROOMS_SECRET!,
			cluster: 'us2'
		});

		switch (req.method) {
			case 'GET':
				const roomQuery = req.query.room;

				if (Array.isArray(roomQuery)) {
					res.status(400).send('Room must be a single room');
				} else if (roomQuery === undefined) {
					const rooms = await client
						.db('rooms')
						.collection<IRoom>('rooms')
						.find({}, { projection: { _id: 0 } })
						.toArray();

					res.status(200).json({ rooms: rooms.map((room) => ({ ...room, id: room.id, ownerId: room.ownerId })) });
				} else {
					const room = await client
						.db('rooms')
						.collection<IRoom>('rooms')
						.findOne({ name: roomQuery }, { projection: { _id: 0 } });

					if (!room) {
						res.status(404).send('Room does not exist');
						break;
					}
					res.status(200).json({ room: { ...room, id: room.id, ownerId: room.ownerId } });
				}
				break;
			case 'POST':
				if (!req.body.name) {
					res.status(400).send('Must include name');
				} else if (!req.body.thisUser) {
					res.status(400).send('Must have user');
				} else {
					if (req.body.settings) {
						const roomSettings: { difficulties: Difficulty[]; speed: number } = req.body.settings;
						const thisUser: UserWithoutScore = req.body.thisUser;
						const name: string = req.body.name;

						const roomId = (
							await client
								.db('rooms')
								.collection<IRoom>('rooms')
								.insertOne({
									name,
									id: uuid(),
									ownerId: thisUser.id,
									settings: { difficulties: roomSettings.difficulties, speed: roomSettings.speed, distro: defaultDistro },
									users: [thisUser],
									answeringUserId: null,
									currentQuestion: null,
									startTime: null
								})
						).insertedId;

						const room = await client
							.db('rooms')
							.collection<IRoom>('rooms')
							.findOne({ _id: roomId }, { projection: { _id: 0 } });

						if (!room) {
							res.status(404).send('Room not found');
							break;
						}

						res.status(200).json({ room });
					} else {
						const settings: RoomSettings = {
							difficulties: [3, 4],
							distro: defaultDistro,
							speed: 120
						};
						const thisUser: UserWithoutScore = req.body.thisUser;
						const name: string = req.body.name;

						const roomId = (
							await client
								.db('rooms')
								.collection<IRoom>('rooms')
								.insertOne({
									name,
									id: uuid(),
									answeringUserId: null,
									ownerId: thisUser.id,
									settings,
									users: [thisUser],
									currentQuestion: null,
									startTime: null
								})
						).insertedId;

						const room = await client
							.db('rooms')
							.collection<IRoom>('rooms')
							.findOne({ _id: roomId }, { projection: { _id: 0 } });

						if (!room) {
							res.status(404).send('Room not found');
							break;
						}

						res.status(200).json({ room });
					}
				}
				break;
			case 'PATCH':
				const { roomId, newDistro }: { roomId?: string; newDistro?: Record<Category, number> } = req.body;

				if (!roomId || !newDistro) {
					res.status(400).send('roomId is missing or newDistro is missing');
					break;
				}

				const room = await client
					.db('rooms')
					.collection<IRoom>('rooms')
					.findOne({ id: roomId }, { projection: { _id: 0 } });

				if (!room) {
					res.status(404).send('Room not found');
					break;
				}

				await client
					.db('rooms')
					.collection<IRoom>('rooms')
					.findOneAndUpdate({ id: roomId }, { $set: { settings: { ...room.settings, distro: newDistro } } });
				res.status(200).send('Distro updated');
				pusher.trigger('quiz-cards-rooms', `ROOM-${room.name}-DISTRO_UPDATE`, { newDistro });
				break;
			default:
				res.status(405).send('Unrecognized Method');
				break;
		}

		client.close();
	} catch (err) {
		console.log(err);
		res.status(500).send('DB Failed to Connect');
	}
};
