import CardReader from '$/CardReader/CardReader';
import CategorySelection from '$/CategorySelection/CategorySelection';
import DifficultySelection from '$/DifficultySelection/DifficultySelection';
import LimitSelector from '$/LimitSelector';
import ModeSelection from '$/ModeSelection';
import QuestionReader from '$/QuestionReader/QuestionReader';
import SpeedSelector from '$/SpeedSelector';
import SubcategorySelection from '$/SubcategorySelection/SubcategorySelection';
import Timer from '$/Timer';
import UIModeSelector from '$/UIModeSelector/UIModeSelector';
import { answeringState } from '@/atoms';
import MySocket from '@/MySocket';
import { compileCardRequest, compileQuestionRequest } from '@/util';
import axios from 'axios';
import cookie from 'cookie';
import { IncomingMessage } from 'http';
import Cookies from 'js-cookie';
import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next/types';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
	AppMode,
	CardResponse,
	DBUser,
	GatewayClientEvent,
	GatewayServerEvent,
	ICard,
	LeaderboardResponse,
	NewUserEvent,
	QuestionReaderMethods,
	QuestionResponse,
	ScoreAction,
	Settings,
	SettingsAction,
	TossupQuestion,
	UIMode,
	User,
	UserWithoutScore
} from 'types';
import styles from '../sass/Index.module.scss';

const settingsReducer: React.Reducer<Settings, SettingsAction> = (settings, action) => {
	switch (action.type) {
		case 'LOAD':
			return action.settings;
		case 'SET_LIMIT':
			return { ...settings, limit: action.limit };
		case 'TOGGLE_CATEGORY':
			return {
				...settings,
				categories: settings.categories.includes(action.category)
					? settings.categories.filter((cat) => cat !== action.category)
					: [...settings.categories, action.category],
				subcategories: settings.subcategories.filter((subcategory) => !subcategory.startsWith(action.category))
			};
		case 'TOGGLE_SUBCATEGORY':
			return {
				...settings,
				subcategories: settings.subcategories.includes(action.subcategory)
					? settings.subcategories.filter((cat) => cat !== action.subcategory)
					: [...settings.categories, action.subcategory]
			};
		case 'SET_MODE':
			return {
				...settings,
				mode: action.mode
			};
		case 'TOGGLE_DIFFICULTY':
			return {
				...settings,
				difficulties: settings.difficulties.includes(action.difficulty)
					? settings.difficulties.filter((dif) => dif !== action.difficulty)
					: [...settings.difficulties, action.difficulty]
			};
		case 'SET_SPEED':
			return { ...settings, speed: action.speed };
		case 'SET_USE_LIMIT':
			return { ...settings, useLimit: action.useLimit };
		case 'SET_UI_MODE':
			return { ...settings, ui_mode: action.mode };
		case 'SET_USER':
			return action.user === null ? { ...settings, user: null } : { ...settings, user: { ...settings.user, ...action.user } };
		default:
			return settings;
	}
};

const scoreReducer: React.Reducer<number, ScoreAction> = (score, action) => {
	switch (action.type) {
		case 'TEN':
			return score + 10;
		case 'NEG':
			return score - 5;
		case 'POWER':
			return score + 15;
		case 'SET':
			return action.score;
		default:
			return score;
	}
};

interface IndexInitialProps {
	settings: Settings;
	score: number;
}

const Index: NextPage<IndexInitialProps> = ({ settings: initialSettings, score: userScore }) => {
	const [cards, setCards] = useState<ICard[]>([]);
	const [questions, setQuestions] = useState<TossupQuestion[]>([]);
	const [timeDisplay, setTimeDisplay] = useState<number>(0);
	const [error, setError] = useState<string>(null);
	const [msg, setMsg] = useState<string>(null);
	const [allowQuery, setAllowQuery] = useState<boolean>(true);
	const [timerActive, setTimerActive] = useState<boolean>(false);
	const [time, setTime] = useState<number>(0);
	const [correct, setCorrect] = useState<boolean>(false);
	const [answering, setAnswering] = useRecoilState(answeringState);
	const [leaderboard, setLeaderboard] = useState<User[]>([]);
	const [score, scoreDispatch] = useReducer<typeof scoreReducer>(scoreReducer, userScore);
	const [socket, setSocket] = useState<MySocket>(null);
	const [eagerName, setEagerName] = useState<string>(initialSettings?.user?.name || '');
	const readerRef = useRef<QuestionReaderMethods>(null);
	const [settings, dispatch] = useReducer<typeof settingsReducer, Settings>(
		settingsReducer,
		initialSettings,
		(init) =>
			init || {
				categories: [],
				subcategories: [],
				difficulties: [3],
				mode: 'card',
				limit: 50,
				useLimit: false,
				speed: 120,
				ui_mode: 'tabled',
				user: null
			}
	);

	const request = useCallback(() => {
		switch (settings.mode) {
			case 'read':
				if (allowQuery) {
					setQuestions([]);
					setError('');
					axios
						.get<QuestionResponse>(
							compileQuestionRequest({
								categories: settings.categories,
								limit: settings.limit,
								subcategories: settings.subcategories,
								difficulties: settings.difficulties,
								internal: true
							})
						)
						.then((res) => {
							if (res.data.num_questions_found === 0) {
								setMsg(`No Questions for categories: ${settings.categories.join(', ')} with subcategories: ${settings.subcategories.join(', ')}`);
							} else {
								setQuestions(res.data.questions);
							}
						})
						.catch((err) => {
							setError(err.response.data);
						});
				}
				break;
			case 'card':
				setCards([]);
				setError('');
				axios
					.get<CardResponse>(
						compileCardRequest('/api/cards', {
							categories: settings.categories,
							subcategories: settings.subcategories,
							limit: settings.useLimit ? settings.limit : 0
						})
					)
					.then((res) => {
						if (res.data.num_cards_found === 0) {
							setMsg(`No Cards for categories: ${settings.categories.join(', ')} with subcategories: ${settings.subcategories.join(', ')}`);
						} else {
							setCards(res.data.cards);
						}
					})
					.catch((err) => {
						setError(err.response.data);
					});
				break;
		}
	}, [settings, allowQuery]);

	const tick = useCallback((remTime: number) => setTimeDisplay(remTime / 1000), []);

	const answerTimeout = useCallback(() => {
		setAnswering(false);
		setAllowQuery(true);
		readerRef.current.endQuestion();
	}, [setAnswering]);

	const mainTimeout = useCallback(() => {
		setAllowQuery(true);
	}, []);

	const keypressHandler = useCallback(
		(evt: KeyboardEvent) => {
			if (evt.code === 'KeyL' && allowQuery && evt.target === document.body) {
				if (readerRef.current) {
					readerRef.current.performReset();
					setTimeDisplay(0);
				}
				request();
			}
		},
		[allowQuery, request]
	);

	useEffect(() => {
		Cookies.set('settings', settings);
		setMsg('');
	}, [settings]);

	useEffect(() => {
		document.addEventListener('keyup', keypressHandler);

		return () => {
			document.removeEventListener('keyup', keypressHandler);
		};
	}, [keypressHandler]);

	useEffect(() => {
		axios.get<LeaderboardResponse>('/api/leaderboard').then((res) => {
			setLeaderboard(res.data.leaderboard);
		});
		const sock = new MySocket(`${location.protocol.replace('http', 'ws')}//${location.hostname}:5000`);

		sock.onMsgOnce((msg) => {
			console.log(msg);
		});

		setSocket(sock);
	}, []);

	useEffect(() => {
		if (socket?.ready) {
			return socket.onMsg<GatewayServerEvent>((msg) => {
				switch (msg.type) {
					case 'POINT_CHANGE':
						setLeaderboard(leaderboard.map((user) => (user._id === msg._id ? { ...user, score: msg.score } : user)));
						if (settings.user && msg._id === settings.user._id) {
							scoreDispatch({ type: 'SET', score: msg.score });
						}
						break;
					case 'NEW_USER':
						setLeaderboard([...leaderboard, { name: msg.name, score: 0, _id: msg._id }]);
						break;
					case 'NAME_CHANGE':
						setLeaderboard(leaderboard.map((user) => (user._id === msg._id ? { ...user, name: msg.name } : user)));
						break;
					default:
						return;
				}
			});
		}
	}, [leaderboard, socket, settings.user]);

	useEffect(() => {
		if (socket && socket.ready && settings.user) {
			socket.json<GatewayClientEvent>({ type: 'POINT_CHANGE', _id: settings.user._id, score });
		}
	}, [score, settings.user, socket]);

	return (
		<div className={styles.main}>
			<Head>
				<title>QuizCards</title>
				<meta name="description" content="Carding application designed for studying for Quiz Bowl, combined with a Protobowl-style question reader" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
			</Head>
			<div className={styles.title}>QuizCards</div>
			<div className={styles.sidebar}>
				<h3>{timeDisplay.toFixed(2)} s</h3>
				{questions.length > 0 || settings.mode === 'card' ? (
					<Timer active={timerActive} time={time} timeout={mainTimeout} tick={tick} />
				) : (
					<Timer active={false} time={1000} dummy />
				)}
				{answering && <Timer active={answering} time={7500} timeout={answerTimeout} tick={tick} answerTimer />}
				<form onSubmit={(evt) => evt.preventDefault()}>
					<CategorySelection onChange={(evt) => dispatch({ type: 'TOGGLE_CATEGORY', category: evt.target.value })} categories={settings.categories} />
					<ModeSelection mode={settings.mode} onChange={(evt) => dispatch({ type: 'SET_MODE', mode: evt.target.value as AppMode })} />
					<SubcategorySelection
						onChange={(evt) => dispatch({ type: 'TOGGLE_SUBCATEGORY', subcategory: evt.target.value })}
						categories={settings.categories}
						subcategories={settings.subcategories}
					/>
					<hr />
					{settings.mode === 'read' && (
						<UIModeSelector onChange={(evt) => dispatch({ type: 'SET_UI_MODE', mode: evt.target.value as UIMode })} ui_mode={settings.ui_mode} />
					)}
					<LimitSelector
						onLimitChange={(evt) => {
							if (/\d*/.test(evt.target.value)) {
								dispatch({ type: 'SET_LIMIT', limit: evt.target.value === '' ? NaN : parseInt(evt.target.value) });
							}
						}}
						onLimitBlur={(evt) => {
							if (evt.target.value === '') {
								dispatch({ type: 'SET_LIMIT', limit: 1 });
							} else if (parseInt(evt.target.value) > 250) {
								dispatch({ type: 'SET_LIMIT', limit: 250 });
							}
						}}
						limit={settings.limit}
						mode={settings.mode}
						useLimit={settings.useLimit}
						onUseLimitChange={(evt) => dispatch({ type: 'SET_USE_LIMIT', useLimit: evt.target.checked })}
					/>
					{settings.mode === 'read' && (
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
					)}
					{settings.mode === 'read' && (
						<DifficultySelection
							onChange={(evt) => dispatch({ type: 'TOGGLE_DIFFICULTY', difficulty: parseInt(evt.target.value) })}
							difficulties={settings.difficulties}
						/>
					)}
					<div>
						<label htmlFor="username">Username: </label>
						<input
							type="text"
							name="username"
							id="username"
							autoComplete="off"
							value={eagerName}
							onChange={(evt) => setEagerName(evt.target.value)}
							onBlur={(evt) => {
								if (leaderboard.map((user) => user.name).includes(evt.target.value)) {
									scoreDispatch({ type: 'SET', score: leaderboard.find((user) => user.name === evt.target.value).score });
									dispatch({ type: 'SET_USER', user: leaderboard.find((user) => user.name === evt.target.value) });
								} else if (!settings.user && evt.target.value !== '') {
									socket.json<GatewayClientEvent>({ type: 'CREATE_USER', name: evt.target.value });
									socket.expect<NewUserEvent>(
										'NEW_USER',
										(msg) => {
											dispatch({ type: 'SET_USER', user: { _id: msg._id, name: msg.name } });
										},
										{ once: true }
									);
								} else if (evt.target.value !== '') {
									socket.json<GatewayClientEvent>({ type: 'NAME_CHANGE', name: evt.target.value, _id: settings.user._id });
								} else {
									dispatch({ type: 'SET_USER', user: null });
									scoreDispatch({ type: 'SET', score: 0 });
								}
							}}
						/>
					</div>
					<hr />
				</form>
				<div>
					<Link href="/create">
						<a rel="noopener noreferrer">Create new cards</a>
					</Link>
				</div>
				<div>
					<Link href="/import">
						<a rel="noopener noreferrer">Import anki cards</a>
					</Link>
				</div>
				<div>
					<Link href="/edit">
						<a rel="noopener noreferrer">Edit existing cards</a>
					</Link>
				</div>
				<div>
					<h4>Note:</h4> this site uses cookies to persist settings between sessions. Disable button coming soon!
				</div>
				<div className={styles.leaderboard}>
					{leaderboard.map((user) =>
						user._id === settings.user?._id ? (
							<div key={user._id} className={styles.entry}>
								<h4>{user.name}</h4> {score}
							</div>
						) : (
							<div key={user._id} className={styles.entry}>
								<h4>{user.name}</h4> {user.score}
							</div>
						)
					)}
				</div>
			</div>

			<div className={styles.content}>
				{settings.mode === 'read' ? (
					<QuestionReader
						{...{
							questions,
							setAllowQuery,
							setMsg,
							request,
							setTime,
							correct,
							setCorrect,
							setTimerActive,
							scoreDispatch,
							ui_mode: settings.ui_mode,
							speed: settings.speed
						}}
						ref={readerRef}
					/>
				) : (
					<CardReader {...{ cards, request }} />
				)}
				<div className={styles.msg}>{msg}</div>
				<div className={styles.error}>{error}</div>
			</div>
		</div>
	);
};

function parseCookies(req: IncomingMessage) {
	return cookie.parse(req.headers.cookie || '');
}

export const getServerSideProps: GetServerSideProps<IndexInitialProps> = async ({ req }) => {
	const dbURL =
		process.env.NODE_ENV === 'development'
			? 'mongodb://localhost:27017'
			: `mongodb+srv://Me:${process.env.MONGODB_PASSWORD}@quiz-cards-cluster-hwc6f.mongodb.net/test?retryWrites=true&w=majority`;
	const mongoClient = await MongoClient.connect(dbURL, { useUnifiedTopology: true });
	const cookies = parseCookies(req);
	const thisUser: UserWithoutScore | null = cookies.settings ? JSON.parse(cookies.settings).user : null;
	const score = thisUser
		? (
				await mongoClient
					.db('cards')
					.collection<DBUser>('leaderboard')
					.findOne({ _id: new ObjectId(thisUser._id) })
		  ).score
		: 0;

	return {
		props: {
			settings: cookies.settings ? JSON.parse(cookies.settings) : null,
			score
		}
	};
};

export default Index;
