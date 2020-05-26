import axios from 'axios';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import CardReader from '../components/CardReader';
import CategorySelection from '../components/CategorySelection';
import LimitSelector from '../components/LimitSelector';
import ModeSelection from '../components/ModeSelection';
import QuestionReader from '../components/QuestionReader/QuestionReader';
import SpeedSelector from '../components/SpeedSelector';
import SubcategorySelection from '../components/SubcategorySelection';
import Timer from '../components/Timer';
import styles from '../sass/Index.module.scss';
import { answeringState } from '../util/atoms';
import { compileCardRequest, compileQuestionRequest } from '../util/util';

const reducer: React.Reducer<string[], string> = (categories, category) => {
	return categories.includes(category) ? categories.filter((cat) => cat !== category) : [...categories, category];
};

const Index: NextPage<{}> = () => {
	const [categories, categoryDispatch] = useReducer(reducer, []);
	const [subcategories, subcategoryDispatch] = useReducer(reducer, []);
	const [mode, setMode] = useState<AppMode>('card');
	const [limit, setLimit] = useState<number>(50);
	const [cards, setCards] = useState<Card[]>([]);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [speed, setSpeed] = useState<number>(120);
	const [difficulty, setDifficulty] = useState<number>(3);
	const [useLimit, setUseLimit] = useState<boolean>(false);
	const [timeDisplay, setTimeDisplay] = useState<number>(0);
	const [error, setError] = useState<string>(null);
	const [msg, setMsg] = useState<string>(null);
	const [allowOperation, setAllowOperation] = useState<boolean>(true);
	const [questionsEnd, setQuestionsEnd] = useState<boolean>(false);
	const [allowQuery, setAllowQuery] = useState<boolean>(true);
	const [timerActive, setTimerActive] = useState<boolean>(false);
	const [time, setTime] = useState<number>(0);
	const [correct, setCorrect] = useState<boolean>(false);
	const [answering, setAnswering] = useRecoilState(answeringState);
	const readerRef = useRef<QuestionReaderMethods>(null);

	const request = useCallback(() => {
		switch (mode) {
			case 'read':
				if (allowQuery) {
					setQuestions([]);
					setError('');
					axios(
						compileQuestionRequest({
							categories,
							limit,
							subcategories,
							difficulty,
							internal: true
						})
					)
						.then((res) => {
							if (res.data.length === 0) {
								setMsg(`No Questions for categories: ${categories.join(', ')} with subcategories: ${subcategories.join(', ')}`);
							} else {
								setQuestions(res.data.data.tossups);
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
				axios(
					compileCardRequest('/api/cards', {
						categories,
						subcategories,
						limit: useLimit ? limit : 0
					})
				)
					.then((res) => {
						if (res.data.length === 0) {
							setMsg(`No Cards for categories: ${categories.join(', ')} with subcategories: ${subcategories.join(', ')}`);
						} else {
							setCards(res.data);
						}
					})
					.catch((err) => {
						setError(err.response.data);
					});
				break;
		}
	}, [mode, questions.length, categories, subcategories, useLimit, limit]);

	const keypressHandler = useCallback(
		(evt: KeyboardEvent) => {
			if (evt.code === 'KeyL' && allowQuery) {
				readerRef.current.performReset();
				request();
			}
		},
		[allowQuery, request, readerRef.current]
	);

	useEffect(() => {
		if (localStorage.getItem('categories')) {
			JSON.parse(localStorage.getItem('categories')).forEach((category) => categoryDispatch(category));
		}
		if (localStorage.getItem('subcategories')) {
			JSON.parse(localStorage.getItem('subcategories')).forEach((subcategory) => subcategoryDispatch(subcategory));
		}
		if (localStorage.getItem('mode')) {
			setMode(localStorage.getItem('mode') as AppMode);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('categories', JSON.stringify(categories));
		localStorage.setItem('subcategories', JSON.stringify(subcategories));
		localStorage.setItem('mode', mode);
	}, [categories, subcategories, mode]);

	useEffect(() => {
		document.addEventListener('keyup', keypressHandler);

		return () => {
			document.removeEventListener('keyup', keypressHandler);
		};
	}, [keypressHandler]);

	useEffect(() => {
		setMsg('');
	}, [mode, categories, subcategories]);

	return (
		<div className={styles.main}>
			<div className={styles.title}>QuizCards</div>
			<div className={styles.sidebar}>
				<h3>{timeDisplay.toFixed(2)} s</h3>
				{questions.length > 0 ? (
					<Timer
						active={timerActive}
						time={time}
						timeout={() => {
							setAllowOperation(true);
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
							setAllowOperation(true);
							setAllowQuery(true);
							readerRef.current.endQuestion();
						}}
						tick={(remTime) => setTimeDisplay(remTime / 1000)}
						answerTimer
					/>
				)}
				<form onSubmit={(evt) => evt.preventDefault()}>
					<CategorySelection dispatch={categoryDispatch} subcatDispatch={subcategoryDispatch} categories={categories} subcategories={subcategories} />
					<ModeSelection mode={mode} setMode={setMode} />
					<SubcategorySelection dispatch={subcategoryDispatch} categories={categories} subcategories={subcategories} />
					<hr id="separator" />
					<LimitSelector setLimit={setLimit} limit={limit} mode={mode} useLimit={useLimit} setUseLimit={setUseLimit} />
					{mode === 'read' && <SpeedSelector setSpeed={setSpeed} speed={speed} />}
					{mode === 'read' && (
						<div>
							<div>Difficulty:</div>
							<select onChange={(evt) => setDifficulty(parseInt(evt.target.value))} value={difficulty}>
								<option value={1}>1 (Middle School)</option>
								<option value={2}>2 (Easy High School)</option>
								<option value={3}>3 (Regular High School)</option>
								<option value={4}>4 (Hard High School)</option>
								<option value={5}>5 (Nationals High School)</option>
								<option value={6}>6 (Easy College)</option>
								<option value={7}>7 (Regular College)</option>
								<option value={8}>8 (Hard College)</option>
								<option value={9}>9 (Open)</option>
							</select>
						</div>
					)}
				</form>
				<div>
					<h4>Hotkeys</h4>
					<div>
						<strong>L</strong>: Load {mode === 'read' ? 'Questions' : 'Cards'}
					</div>
					<div>
						<strong>N</strong>: Next {mode === 'read' ? 'Question' : 'Card'}
					</div>
					{mode === 'card' && (
						<div>
							<strong>B</strong>: Previous Card
						</div>
					)}
					<div>
						<strong>Spacebar</strong>: {mode === 'read' ? 'Buzz' : 'Flip Card'}
					</div>
				</div>
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
			</div>

			<div className={styles.content}>
				{mode === 'read' ? (
					<QuestionReader
						{...{
							questions,
							speed,
							setAllowQuery,
							setAllowOperation,
							setMsg,
							request,
							setTime,
							correct,
							setCorrect,
							setTimerActive
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

export default Index;
