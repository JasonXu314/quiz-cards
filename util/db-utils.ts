import { MongoClient } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { defaultDistro } from './util';

export async function getRoom(name: string): Promise<IRoom | null> {
	try {
		const mongoClient = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });

		const room = await mongoClient
			.db('rooms')
			.collection<IRoom>('rooms')
			.findOne({ name }, { projection: { _id: 0 } });

		return room;
	} catch (err) {
		return null;
	}
}

export async function createRoom(
	name: string,
	user: UserWithoutScore,
	settings: { difficulties: Difficulty[]; speed: number } = { difficulties: [3, 4], speed: 120 }
): Promise<IRoom | null> {
	try {
		const mongoClient = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });

		const newRoomId = (
			await mongoClient
				.db('rooms')
				.collection<IRoom>('rooms')
				.insertOne({
					name,
					settings: { ...settings, distro: defaultDistro },
					ownerId: user.id,
					users: [user],
					id: uuid(),
					answeringUserId: null,
					currentQuestion: null,
					startTime: null
				})
		).insertedId;

		const newRoom = await mongoClient
			.db('rooms')
			.collection<IRoom>('rooms')
			.findOne({ _id: newRoomId }, { projection: { _id: 0 } });

		return newRoom;
	} catch (err) {
		return null;
	}
}

export async function getUserById(id: string): Promise<IUser | null> {
	try {
		const mongoClient = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });

		const user = await mongoClient
			.db('rooms')
			.collection<IUser>('roomUsers')
			.findOne({ id }, { projection: { _id: 0 } });

		return user;
	} catch (err) {
		return null;
	}
}

export async function createUser(name: string): Promise<IUser | null> {
	try {
		const mongoClient = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });

		const newUserId = (await mongoClient.db('rooms').collection<IUser>('roomUsers').insertOne({ id: uuid(), score: 0, name })).insertedId;

		const newUser = await mongoClient
			.db('rooms')
			.collection<IUser>('roomUsers')
			.findOne({ _id: newUserId }, { projection: { _id: 0 } });

		return newUser;
	} catch (err) {
		return null;
	}
}

export async function createLeaderboard(room: IRoom, init: IUser[] = []): Promise<ILeaderboard | null> {
	try {
		const mongoClient = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });

		const newLeaderboard = (await mongoClient.db('rooms').collection<ILeaderboard>('leaderboards').insertOne({ roomId: room.id, leaderboard: init }))
			.ops[0];

		return newLeaderboard;
	} catch (err) {
		return null;
	}
}

export async function appendLeaderboard(room: IRoom, user: IUser): Promise<ILeaderboard | null> {
	try {
		const mongoClient = await MongoClient.connect(process.env.MONGODB_URL!, { useUnifiedTopology: true });

		const leaderboard = await mongoClient
			.db('rooms')
			.collection<ILeaderboard>('leaderboards')
			.findOne({ roomId: room.id }, { projection: { _id: false } });

		await mongoClient
			.db('rooms')
			.collection<ILeaderboard>('leaderboards')
			.findOneAndUpdate({ roomId: room.id }, { $set: { leaderboard: [...leaderboard!.leaderboard, user] } });

		return leaderboard;
	} catch (err) {
		return null;
	}
}

export function sanitize(obj: NonNullable<any>): any {
	return Object.fromEntries(Object.entries(obj).filter(([prop]) => prop !== '_id'));
}
