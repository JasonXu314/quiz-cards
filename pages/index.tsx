import axios from 'axios';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useCallback, useEffect, useReducer, useState } from 'react';
import AnswerBox from '../components/AnswerBox';
import Card from '../components/Card';
import CategorySelection from '../components/CategorySelection';
import LimitSelector from '../components/LimitSelector';
import ModeSelection from '../components/ModeSelection';
import QuestionReader from '../components/QuestionReader';
import SpeedSelector from '../components/SpeedSelector';
import SubcategorySelection from '../components/SubcategorySelection';
import Timer from '../components/Timer';
import styles from '../sass/Index.module.scss';
import { checkAns, compileCardRequest, compileQuestionRequest } from '../util/util';

const reducer: React.Reducer<string[], string> = (categories, category) => {
	return categories.includes(category) ? categories.filter((cat) => cat !== category) : [...categories, category];
};

const Index: NextPage<{}> = () => {
	const [categories, categoryDispatch] = useReducer(reducer, [], (def) => {
		if (typeof window === 'undefined') {
			return def;
		} else {
			if (localStorage.getItem('categories')) {
				return JSON.parse(localStorage.getItem('categories'));
			} else {
				return def;
			}
		}
	});
	const [subcategories, subcategoryDispatch] = useReducer(reducer, [], (def) => {
		if (typeof window === 'undefined') {
			return def;
		} else {
			if (localStorage.getItem('subcategories')) {
				return JSON.parse(localStorage.getItem('subcategories'));
			} else {
				return def;
			}
		}
	});
	const [mode, setMode] = useState<AppMode>(() => {
		if (typeof window === 'undefined') {
			return 'card';
		} else {
			if (localStorage.getItem('mode')) {
				return localStorage.getItem('mode') as AppMode;
			} else {
				return 'card';
			}
		}
	});
	const [limit, setLimit] = useState<number>(50);
	const [cards, setCards] = useState<Card[]>([]);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [speed, setSpeed] = useState<number>(120);
	const [questionIndex, setQuestionIndex] = useState<number>(0);
	const [cardIndex, setCardIndex] = useState<number>(0);
	const [active, setActive] = useState<boolean>(false);
	const [answering, setAnswering] = useState<boolean>(false);
	const [userAnswer, setUserAnswer] = useState<string>('');
	const [questionFinished, setQuestionFinished] = useState<boolean>(false);
	const [correct, setCorrect] = useState<boolean>(false);
	const [difficulty, setDifficulty] = useState<number>(3);
	const [useLimit, setUseLimit] = useState<boolean>(false);
	const [timeDisplay, setTimeDisplay] = useState<number>(0);
	const [error, setError] = useState<string>(null);
	const [msg, setMsg] = useState<string>(null);

	const request = useCallback(() => {
		switch (mode) {
			case 'read':
				if (!active && !answering && (questionFinished || questions.length === 0)) {
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
								setActive(true);
								setQuestionFinished(false);
								setQuestionIndex(0);
							}
						})
						.catch((err) => {
							setError(err.response.data);
						});
				}
				break;
			case 'card':
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
	}, [mode, active, answering, questionFinished, questions, categories, subcategories, useLimit]);

	const keypressHandler = useCallback(
		(evt: KeyboardEvent) => {
			switch (evt.code) {
				case 'Space':
					if (active && !answering && !questionFinished && mode === 'read') {
						setActive(false);
						setAnswering(true);
					}
					break;
				case 'KeyN':
					if (!active && !answering && questionFinished && mode === 'read') {
						setActive(true);
						setAnswering(false);
						setQuestionFinished(false);
						setQuestionIndex(questionIndex + 1);
						setUserAnswer('');
					}
					break;
				case 'KeyL':
					request();
					break;
				default:
					break;
			}
		},
		[active, answering, questionFinished, questionIndex, mode, categories, subcategories, questions]
	);

	useEffect(() => {
		document.addEventListener('keyup', keypressHandler);

		window.onbeforeunload = () => {
			localStorage.setItem('categories', JSON.stringify(categories));
			localStorage.setItem('subcategories', JSON.stringify(subcategories));
			localStorage.setItem('mode', mode);
		};

		return () => {
			document.removeEventListener('keyup', keypressHandler);
			window.onbeforeunload = null;
		};
	}, [keypressHandler]);

	return (
		<div className={styles.main}>
			<div className={styles.title}>QuizCards</div>
			<div className={styles.sidebar}>
				<h3>{timeDisplay.toFixed(2)} s</h3>
				{questions.length > 0 ? (
					<Timer
						active={active}
						time={questions[questionIndex].text.split(' ').length * speed + 5000}
						timeout={() => {
							setActive(false);
							setQuestionFinished(true);
						}}
						tick={(remTime) => {
							setTimeDisplay(remTime / 1000);
						}}
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
							setActive(false);
							setQuestionFinished(true);
							setCorrect(checkAns(userAnswer, questions[questionIndex].answer));
						}}
						tick={(remTime) => {
							setTimeDisplay(remTime / 1000);
						}}
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
						<strong>L</strong>: Load Questions/Cards
					</div>
					<div>
						<strong>N</strong>: Next Question/Card
					</div>
					<div>
						<strong>Spacebar</strong>: Buzz
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
				<div className={styles.row}>
					<button className={styles.secondary} onClick={request}>
						Load {mode === 'card' ? 'Cards' : 'Questions'}
					</button>
					<button
						className={styles.action}
						onClick={() => {
							setActive(false);
							setAnswering(true);
						}}
						disabled={mode === 'card' || !active || answering || questionFinished}>
						Buzz!
					</button>
					<button
						className={styles.secondary}
						onClick={() => {
							if (cardIndex === 0) {
								setCardIndex(cards.length - 1);
							} else {
								setCardIndex(cardIndex - 1);
							}
						}}
						disabled={mode === 'read' || cards.length === 0}>
						&lt; Back
					</button>
					<button
						className={styles.primary}
						onClick={() => {
							setActive(true);
							if (mode === 'read') {
								setQuestionFinished(false);
								setQuestionIndex(questionIndex + 1);
								setUserAnswer('');
							} else {
								if (cardIndex === cards.length - 1) {
									setCardIndex(0);
								} else {
									setCardIndex(cardIndex + 1);
								}
							}
						}}
						disabled={mode === 'read' ? active || answering || !questionFinished : cards.length === 0}>
						Next &gt;
					</button>
				</div>
				{mode === 'read'
					? questions.length > 0 && (
							<>
								<QuestionReader
									question={questions[questionIndex]}
									speed={speed}
									setActive={setActive}
									active={active}
									questionFinished={questionFinished}
									correct={correct}
								/>
								{questionFinished && <div>Your Answer: {userAnswer}</div>}
							</>
					  )
					: cards.length > 0 && <Card card={cards[cardIndex]} key={cards[cardIndex]._id} />}
				{answering && (
					<AnswerBox
						onChange={(evt) => setUserAnswer(evt.target.value)}
						value={userAnswer}
						onSubmit={(evt) => {
							evt.preventDefault();
							setAnswering(false);
							setActive(false);
							setQuestionFinished(true);
							setCorrect(checkAns(userAnswer, questions[questionIndex].answer));
						}}
					/>
				)}
				<div className={styles.msg}>{msg}</div>
				<div className={styles.error}>{error}</div>
			</div>
		</div>
	);
};

export default Index;
