import { createServer } from 'http';
import { MongoClient, ObjectId } from 'mongodb';
import next from 'next';
import { DBUser, GatewayClientEvent } from 'types';
import { parse } from 'url';
import ws from 'ws';

const port = parseInt(process.env.PORT || '3000');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
let serverAddress: string;

app.prepare().then(() => {
	createServer((req, res) => {
		const parsedUrl = parse(req.url!, true);

		// if (parsedUrl.pathname.endsWith('/socket')) {
		// 	res.write(serverAddress);
		// 	res.end();
		// } else {
		// 	handle(req, res, parsedUrl);
		// }
		res.write(serverAddress);
		res.end();
	}).listen(port);
});

(async () => {
	const dbURL =
		process.env.NODE_ENV === 'development'
			? 'mongodb://localhost:27017'
			: `mongodb+srv://Me:${process.env.MONGODB_PASSWORD}@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`;
	const mongoClient = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
	const server = new ws.Server({ port: 5000 });
	server.on('connection', (socket) => {
		socket.send(JSON.stringify({ msg: 'Connected to server' }));

		socket.on('message', async (msg) => {
			const evt: GatewayClientEvent = JSON.parse(msg as string);
			const db = mongoClient.db('cards');
			switch (evt.type) {
				case 'POINT_CHANGE':
					db.collection<DBUser>('leaderboard').updateOne({ _id: new ObjectId(evt._id) }, { $set: { score: evt.score } });
					server.clients.forEach((client) => {
						if (client !== socket) {
							client.send(JSON.stringify({ type: 'POINT_CHANGE', _id: evt._id, score: evt.score }));
						}
					});
					break;
				case 'CREATE_USER':
					const createdUser = await db
						.collection<DBUser>('leaderboard')
						.insertOne({ name: evt.name, score: 0, _id: ObjectId.createFromTime(Date.now()) });
					server.clients.forEach((client) => {
						client.send(JSON.stringify({ type: 'NEW_USER', ...createdUser.ops[0] }));
					});
					break;
				case 'NAME_CHANGE':
					await db.collection<DBUser>('leaderboard').updateOne({ _id: new ObjectId(evt._id) }, { $set: { name: evt.name } });
					server.clients.forEach((client) => {
						if (client !== socket) {
							client.send(JSON.stringify({ type: 'NAME_CHANGE', _id: evt._id, name: evt.name }));
						}
					});
					break;
			}
		});
	});

	server.once('listening', () => {
		serverAddress = JSON.stringify(server.address());
		console.log(`WebSocket server listening at ${JSON.stringify(server.address())}!`);
	});
})();
