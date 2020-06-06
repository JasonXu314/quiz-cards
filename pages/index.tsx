import axios from 'axios';
import cookie from 'cookie';
import { IncomingMessage } from 'http';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next/types';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import CardReader from '../components/CardReader/CardReader';
import CategorySelection from '../components/CategorySelection/CategorySelection';
import DifficultySelection from '../components/DifficultySelection/DifficultySelection';
import LimitSelector from '../components/LimitSelector';
import ModeSelection from '../components/ModeSelection';
import QuestionReader from '../components/QuestionReader/QuestionReader';
import SpeedSelector from '../components/SpeedSelector';
import SubcategorySelection from '../components/SubcategorySelection/SubcategorySelection';
import Timer from '../components/Timer';
import UIModeSelector from '../components/UIModeSelector/UIModeSelector';
import styles from '../sass/Index.module.scss';
import { answeringState } from '../util/atoms';
import { compileCardRequest, compileQuestionRequest } from '../util/util';

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
		default:
			return settings;
	}
};

const Index: NextPage<{ settings: Settings }> = ({ settings: initialSettings }) => {
	const [cards, setCards] = useState<Card[]>([]);
	const [questions, setQuestions] = useState<TossupQuestion[]>([]);
	const [timeDisplay, setTimeDisplay] = useState<number>(0);
	const [error, setError] = useState<string>(null);
	const [msg, setMsg] = useState<string>(null);
	const [allowQuery, setAllowQuery] = useState<boolean>(true);
	const [timerActive, setTimerActive] = useState<boolean>(false);
	const [time, setTime] = useState<number>(0);
	const [correct, setCorrect] = useState<boolean>(false);
	const [answering, setAnswering] = useRecoilState(answeringState);
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
				ui_mode: 'tabled'
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
	}, [settings, questions]);

	const keypressHandler = useCallback(
		(evt: KeyboardEvent) => {
			if (evt.code === 'KeyL' && allowQuery) {
				if (readerRef.current) {
					readerRef.current.performReset();
					setTimeDisplay(0);
				}
				request();
			}
		},
		[allowQuery, request, readerRef.current]
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

	return (
		<div className={styles.main}>
			<Head>
				<title>QuizCards</title>
			</Head>
			<div className={styles.title}>QuizCards</div>
			<div className={styles.sidebar}>
				<h3>{timeDisplay.toFixed(2)} s</h3>
				{questions.length > 0 || settings.mode === 'card' ? (
					<Timer
						active={timerActive}
						time={time}
						timeout={() => {
							setAllowQuery(true);
						}}
						tick={(remTime) => setTimeDisplay(remTime / 1000)}
					/>
				) : (
					<Timer active={false} time={1000} timeout={() => {}} tick={() => {}} dummy />
				)}
				{answering && (
					<Timer
						active={answering}
						time={7500}
						timeout={() => {
							setAnswering(false);
							setAllowQuery(true);
							readerRef.current.endQuestion();
						}}
						tick={(remTime) => setTimeDisplay(remTime / 1000)}
						answerTimer
					/>
				)}
				<form onSubmit={(evt) => evt.preventDefault()}>
					<CategorySelection onChange={(evt) => dispatch({ type: 'TOGGLE_CATEGORY', category: evt.target.value })} categories={settings.categories} />
					<ModeSelection mode={settings.mode} onChange={(evt) => dispatch({ type: 'SET_MODE', mode: evt.target.value as AppMode })} />
					<SubcategorySelection
						onChange={(evt) => dispatch({ type: 'TOGGLE_SUBCATEGORY', subcategory: evt.target.value })}
						categories={settings.categories}
						subcategories={settings.subcategories}
					/>
					<hr id="separator" />
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
				</form>
				<hr />
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
	return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const cookies = parseCookies(req);

	return {
		props: {
			settings: JSON.parse(cookies.settings) || null
		}
	};
};

export default Index;
