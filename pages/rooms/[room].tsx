import DifficultySelection from '$/DifficultySelection/DifficultySelection';
import SpeedSelector from '$/SpeedSelector';
import Timer from '$/Timer';
import UIModeSelector from '$/UIModeSelector/UIModeSelector';
import { answeringState } from '@/atoms';
import { categories } from '@/constants';
import { parseCookies } from '@/util';
import { MongoClient, ObjectId } from 'mongodb';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import generate from 'project-name-generator';
import Pusher from 'pusher-js';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { DBUser, Difficulty, IRoom, QuestionReaderMethods, RoomSettings, RoomSettingsAction, ScoreChangeEvent, Settings, UIMode, UserWithoutScore } from 'types';
import styles from '../../sass/Room.module.scss';

interface RoomInitialProps {
	room: IRoom<'client'>;
	isOwner: boolean;
	thisUser: UserWithoutScore;
}

const reducer: React.Reducer<RoomSettings, RoomSettingsAction> = (prevSettings, action) => {
	switch (action.type) {
		case 'SET_SPEED':
			return { ...prevSettings, speed: action.speed };
		case 'TOGGLE_DIFFICULTY':
			return {
				...prevSettings,
				difficulties: prevSettings.difficulties.includes(action.difficulty)
					? prevSettings.difficulties.filter((diff) => diff !== action.difficulty)
					: [...prevSettings.difficulties, action.difficulty]
			};
		default:
			return prevSettings;
	}
};

const Room: NextPage<RoomInitialProps> = ({ isOwner, room, thisUser }) => {
	const [timeDisplay, setTimeDisplay] = useState<number>(0);
	const [timerActive, setTimerActive] = useState<boolean>(false);
	const [time, setTime] = useState<number>(0);
	const [answering, setAnswering] = useRecoilState(answeringState);
	const [settings, dispatch] = useReducer<typeof reducer>(reducer, room.settings);
	const [uiMode, setUiMode] = useState<UIMode>('tabled');
	const [eagerName, setEagerName] = useState<string>('');
	const [msg, setMsg] = useState<string>('');
	const [err, setErr] = useState<string>('');
	const readerRef = useRef<QuestionReaderMethods>(null);
	const router = useRouter();

	const tick = useCallback((remTime: number) => setTimeDisplay(remTime / 1000), []);

	const answerTimeout = useCallback(() => {
		setAnswering(false);
		readerRef.current?.endQuestion();
	}, [setAnswering]);

	useEffect(() => {
		const pusherClient = new Pusher('6c95fefa51ed75c3d496', { cluster: 'us2' });
		pusherClient.channel(`room-${room.name}`).bind('SCORE_CHANGE', (evt: ScoreChangeEvent) => {
			console.log(evt);
		});
	}, [room]);

	if (isOwner) {
		return (
			<div className={styles.main}>
				<Head>
					<title>QuizCards - {router.query.room}</title>
					<meta name="description" content="Carding application designed for studying for Quiz Bowl, combined with a Protobowl-style question reader" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
				</Head>
				<div className={styles.title}>QuizCards</div>
				<div className={styles.sidebar}>
					<h3>{timeDisplay.toFixed(2)} s</h3>
					<Timer active={timerActive} time={time} tick={tick} />
					{answering && <Timer active={answering} time={7500} timeout={answerTimeout} tick={tick} answerTimer />}
					<form onSubmit={(evt) => evt.preventDefault()}>
						<div className={styles.distro}>
							{categories.entries.map(([categoryName, category]) => (
								<div key={category.id} className={styles.category}></div>
							))}
						</div>
						<hr />
						<UIModeSelector onChange={(evt) => setUiMode(evt.target.value as UIMode)} uiMode={uiMode} />
						<SpeedSelector
							onChange={(evt) => {
								if (/-?(\d*|\d*\.\d*|\.\d*)([eE][-+]?\d*)?/.test(evt.target.value)) {
									dispatch({ type: 'SET_SPEED', speed: evt.target.value === '' ? NaN : parseInt(evt.target.value) });
								}
							}}
							onBlur={(evt) => {
								if (evt.target.value === '' || parseInt(evt.target.value) < 10) {
									dispatch({ type: 'SET_SPEED', speed: 10 });
								} else if (parseInt(evt.target.value) > 1000) {
									dispatch({ type: 'SET_SPEED', speed: 1000 });
								}
							}}
							speed={settings.speed}
						/>
						<DifficultySelection
							onChange={(evt) => dispatch({ type: 'TOGGLE_DIFFICULTY', difficulty: parseInt(evt.target.value) as Difficulty })}
							difficulties={settings.difficulties}
						/>
						<div>
							<label htmlFor="username">Username: </label>
							{/* <input
								type="text"
								name="username"
								id="username"
								autoComplete="off"
								value={eagerName}
								onChange={(evt) => setEagerName(evt.target.value)}
								onBlur={(evt) => {
									if (leaderboardData?.leaderboard.map((user) => user.name).includes(evt.target.value)) {
										const { _id, name } = leaderboardData.leaderboard.find((user) => user.name === evt.target.value)!;

										dispatch({ type: 'SET_USER', user: { _id, name } });
									} else if (!settings.user && evt.target.value !== '') {
										axios
											.post<CreateUserResponse>('/api/gateway/user', {
												name: evt.target.value
											})
											.then((res) => {
												dispatch({ type: 'SET_USER', user: res.data.user });
											});
									} else if (evt.target.value !== '') {
										axios.patch('/api/gateway/user', {
											_id: settings.user!._id,
											name: evt.target.value
										});
									} else {
										dispatch({ type: 'SET_USER', user: null });
									}
								}}
							/> */}
						</div>
						<hr />
					</form>
					<div>
						<h4>Note:</h4> this site uses cookies to persist settings between sessions. Disable button coming soon!
					</div>
					{/* <div className={styles.leaderboard}>
						{leaderboardError ? (
							<div className={styles.entry}>Error loading leaderboard...</div>
						) : leaderboardData ? (
							leaderboardData.leaderboard.map((user) => (
								<div key={user._id} className={styles.entry}>
									<h4>{user.name}</h4> {user.score}
								</div>
							))
						) : (
							<div className={styles.entry}>Loading...</div>
						)}
					</div> */}
				</div>

				<div className={styles.content}>
					{/* <QuestionReader
						{...{
							questions,
							setAllowQuery,
							setMsg,
							request,
							setTime,
							correct,
							setCorrect,
							setTimerActive
						}}
						ui_mode={settings}
						userId={settings.user?._id}
						speed={settings.speed}
						ref={readerRef}
					/> */}
					<div className={styles.msg}>{msg}</div>
					<div className={styles.err}>{err}</div>
				</div>
			</div>
		);
	}
	return <div>yo</div>;
};

export const getServerSideProps: GetServerSideProps<RoomInitialProps | { redirect: boolean }> = async ({ req, res, query }) => {
	const cookies = parseCookies(req);
	const settings: Settings | null = cookies.settings ? JSON.parse(cookies.settings) : null;
	const dbURL =
		process.env.NODE_ENV === 'development'
			? 'mongodb://localhost:27017'
			: `mongodb+srv://Me:${process.env.MONGODB_PASSWORD}@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`;
	const client = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
	const collection = client.db('rooms').collection<IRoom<'server'>>('index');
	const rooms = await collection.find().toArray();

	if (settings) {
		if (Array.isArray(query.room!)) {
			res.writeHead(301, {
				Location: '/rooms'
			}).end();
			return { props: { redirect: true } };
		}

		if (rooms.map((room) => room.name).includes(query.room!)) {
			const room = rooms.find((room) => room.name === query.room!)!;

			const templateUser = {
				name: generate({ alliterative: true })
					.raw.map((word) => (word as string).slice(0, 1).toLocaleUpperCase() + (word as string).slice(1))
					.join(' '),
				score: 0,
				_id: settings.user?._id ? new ObjectId(settings.user._id) : new ObjectId()
			};

			const newUser = (await client.db('rooms').collection<DBUser>('users').insertOne(templateUser)).ops[0];

			return {
				props: {
					isOwner: !!(newUser._id && room.ownerId.equals(newUser._id)),
					thisUser: { _id: newUser._id.toHexString(), name: newUser.name },
					room: { ...room, ownerId: room.ownerId.toHexString(), _id: room._id.toHexString() }
				}
			};
		} else {
			if (!settings.user) {
				const templateUser = {
					name: generate({ alliterative: true })
						.raw.map((word) => (word as string).slice(0, 1).toLocaleUpperCase() + (word as string).slice(1))
						.join(' '),
					score: 0
				};

				const newUser = (await client.db('rooms').collection<DBUser>('users').insertOne(templateUser)).ops[0];

				const room = (
					await collection.insertOne({
						name: query.room!,
						ownerId: new ObjectId(newUser._id),
						users: [{ _id: newUser._id.toHexString(), name: newUser.name }],
						settings: {
							distro: {
								'Current Events': 2.5,
								'Fine Arts': 15,
								Geography: 5,
								History: 20,
								Literature: 20,
								Mythology: 5,
								Philosophy: 2.5,
								Religion: 2.5,
								Science: 20,
								'Social Science': 5,
								Trash: 2.5
							},
							difficulties: [...settings.difficulties],
							speed: settings.speed
						}
					})
				).ops[0];

				return {
					props: {
						isOwner: true,
						thisUser: { _id: newUser._id.toHexString(), name: newUser.name },
						room: { ...room, ownerId: room.ownerId.toHexString(), _id: room._id.toHexString() }
					}
				};
			} else {
				const room = (
					await collection.insertOne({
						name: query.room!,
						ownerId: new ObjectId(settings.user._id),
						users: [settings.user],
						settings: {
							distro: {
								'Current Events': 2.5,
								'Fine Arts': 15,
								Geography: 5,
								History: 20,
								Literature: 20,
								Mythology: 5,
								Philosophy: 2.5,
								Religion: 2.5,
								Science: 20,
								'Social Science': 5,
								Trash: 2.5
							},
							difficulties: [...settings.difficulties],
							speed: settings.speed
						}
					})
				).ops[0];

				return {
					props: {
						isOwner: true,
						thisUser: settings.user,
						room: { ...room, ownerId: room.ownerId.toHexString(), _id: room._id.toHexString() }
					}
				};
			}
		}
	} else {
		if (Array.isArray(query.room!)) {
			res.writeHead(301, {
				Location: '/rooms'
			}).end();
			return { props: { redirect: true } };
		}

		if (rooms.map((room) => room.name).includes(query.room!)) {
			const room = rooms.find((room) => room.name === query.room!)!;

			const templateUser = {
				name: generate({ alliterative: true })
					.raw.map((word) => (word as string).slice(0, 1).toLocaleUpperCase() + (word as string).slice(1))
					.join(' '),
				score: 0,
				room: query.room!
			};

			const newUser = (await client.db('rooms').collection<DBUser>('users').insertOne(templateUser)).ops[0];

			return {
				props: {
					isOwner: false,
					thisUser: { _id: newUser._id.toHexString(), name: newUser.name },
					room: { ...room, ownerId: room.ownerId.toHexString(), _id: room._id.toHexString() }
				}
			};
		} else {
			const templateUser = {
				name: generate({ alliterative: true })
					.raw.map((word) => (word as string).slice(0, 1).toLocaleUpperCase() + (word as string).slice(1))
					.join(' '),
				score: 0,
				room: query.room!
			};

			const newUser = (await client.db('rooms').collection<DBUser>('users').insertOne(templateUser)).ops[0];

			const room = (
				await collection.insertOne({
					name: query.room!,
					ownerId: new ObjectId(newUser._id),
					users: [{ _id: newUser._id.toHexString(), name: newUser.name }],
					settings: {
						distro: {
							'Current Events': 2.5,
							'Fine Arts': 15,
							Geography: 5,
							History: 20,
							Literature: 20,
							Mythology: 5,
							Philosophy: 2.5,
							Religion: 2.5,
							Science: 20,
							'Social Science': 5,
							Trash: 2.5
						},
						difficulties: [3, 4],
						speed: 120
					}
				})
			).ops[0];

			return {
				props: {
					isOwner: true,
					thisUser: { _id: newUser._id.toHexString(), name: newUser.name },
					room: { ...room, ownerId: room.ownerId.toHexString(), _id: room._id.toHexString() }
				}
			};
		}
	}
};

export default Room;
