import axios from 'axios';
import Link from 'next/link';
import { NextPage } from 'next/types';
import { useReducer, useState } from 'react';
import AnswerBox from '../components/AnswerBox';
import Card from '../components/Card';
import CategorySelection from '../components/CategorySelection';
import LimitSelector from '../components/LimitSelector';
import ModeSelection from '../components/ModeSelection';
import QuestionReader from '../components/QuestionReader';
import SpeedSelector from '../components/SpeedSelector';
import SubcategorySelection from '../components/SubcategorySelection';
import Timer from '../components/Timer';
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
	const [questionIndex, setQuestionIndex] = useState<number>(0);
	const [cardIndex, setCardIndex] = useState<number>(0);
	const [active, setActive] = useState<boolean>(false);
	const [answering, setAnswering] = useState<boolean>(false);
	const [userAnswer, setUserAnswer] = useState<string>('');
	const [questionFinished, setQuestionFinished] = useState<boolean>(false);
	const [correct, setCorrect] = useState<boolean>(false);
	const [difficulty, setDifficulty] = useState<number>(3);
	const [useLimit, setUseLimit] = useState<boolean>(false);

	return (
		<div id = "main">
			<div id = "title">
				QuizCards
			</div>
			<div id = "sidebar">
				{questions.length > 0 ? 
					<Timer active = {active} time = {questions[questionIndex].text.split(' ').length * speed + 5000} timeout = {() => {
						setActive(false);
						setQuestionFinished(true);
					}} /> :
					<progress value = {1} max = "1" />}
				{answering && <Timer active time = {7500} timeout = {() => {
					setAnswering(false);
					setQuestionFinished(true);
					setCorrect(questions[questionIndex].answer === userAnswer || questions[questionIndex].answer.toLowerCase().includes(userAnswer.toLowerCase()));
				}} />}
				<form onSubmit = {(evt) => evt.preventDefault()}>
					<CategorySelection dispatch = {categoryDispatch} subcatDispatch = {subcategoryDispatch} categories = {categories}
						subcategories = {subcategories} />
					<ModeSelection mode = {mode} setMode = {setMode} />
					<SubcategorySelection dispatch = {subcategoryDispatch} categories = {categories} subcategories = {subcategories} />
					<hr id = "separator" />
					<LimitSelector setLimit = {setLimit} limit = {limit} mode = {mode} useLimit = {useLimit} setUseLimit = {setUseLimit} />
					{mode === 'read' && <SpeedSelector setSpeed = {setSpeed} speed = {speed} />}
					{mode === 'read' && <div>
						<div>Difficulty:</div>
						<select onChange = {(evt) => setDifficulty(parseInt(evt.target.value))} value = {difficulty}>
							<option value = {1}>1 (Middle School)</option>
							<option value = {2}>2 (Easy High School)</option>
							<option value = {3}>3 (Regular High School)</option>
							<option value = {4}>4 (Hard High School)</option>
							<option value = {5}>5 (Nationals High School)</option>
							<option value = {6}>6 (Easy College)</option>
							<option value = {7}>7 (Regular College)</option>
							<option value = {8}>8 (Hard College)</option>
							<option value = {9}>9 (Open)</option>
						</select>
					</div>}
				</form>
				<div>
					<Link href = "/create"><a rel = "noopener noreferrer">Create new cards</a></Link>
				</div>
				<div>
					<Link href = "/import"><a rel = "noopener noreferrer">Import anki cards</a></Link>
				</div>
				<div>
					<Link href = "/edit"><a rel = "noopener noreferrer">Edit existing cards</a></Link>
				</div>
			</div>

			<div id = "content">
				<div className = "button-row">
					<button onClick = {() => {
						switch (mode) {
							case ('read'):
								axios(compileQuestionRequest({
									categories,
									limit,
									subcategories,
									difficulty,
									internal: true
								}))
									.then((res) => {
										setQuestions(res.data.data.tossups);
										setActive(true);
									})
									.catch((err) => {
										console.log(err.response);
									});
								break;
							case ('card'):
								axios(compileCardRequest('/api/cards', {
									categories,
									subcategories,
									limit: useLimit ? limit : 0
								}))
									.then((res) => {
										setCards(res.data);
									})
									.catch((err) => {
										console.log(err.response);
									});
								break;
						}
					}}>Load {mode === 'card' ? 'Cards' : 'Questions'}</button>
					<button onClick = {() => {
						setActive(false);
						setAnswering(true);
					}} disabled = {mode === 'card'}>Buzz!</button>
					<button onClick = {() => {
						if (cardIndex === 0) {
							setCardIndex(cards.length - 1);
						}
						else {
							setCardIndex(cardIndex - 1);
						}
					}} disabled = {mode === 'read'}>&lt; Back</button>
					<button onClick = {() => {
						setActive(true);
						if (mode === 'read') {
							setQuestionFinished(false);
							setQuestionIndex(questionIndex + 1);
						}
						else {
							if (cardIndex === cards.length - 1) {
								setCardIndex(0);
							}
							else {
								setCardIndex(cardIndex + 1);
							}
						}
					}} disabled = {mode === 'read' && active}>Next &gt;</button>
				</div>
				{mode === 'read' ?
					(questions.length > 0 && <QuestionReader question = {questions[questionIndex]} speed = {speed} setActive = {setActive} active = {active}
						questionFinished = {questionFinished} correct = {correct} />) : 
					(cards.length > 0 && <Card card = {cards[cardIndex]} key = {cards[cardIndex]._id} />)}
				{answering && <AnswerBox onChange = {(evt) => setUserAnswer(evt.target.value)}  value = {userAnswer} onSubmit = {(evt) => {
					evt.preventDefault();
					setAnswering(false);
					setQuestionFinished(true);
					setUserAnswer('');
					setCorrect(questions[questionIndex].answer === userAnswer || questions[questionIndex].answer.toLowerCase().includes(userAnswer.toLowerCase()));
				}} />}
			</div>

			<style jsx>{`
				div#main {
					display: grid;
					grid-template: "title ." 1fr "questions sidebar" auto / 12fr 3fr;
				}

				div#main div#title {
					grid-area: title;
				}

				div#main div#sidebar {
					grid-area: sidebar;
				}

				div#main div#sidebar form hr {
					margin-top: 0.3em;
					margin-bottom: 0.3em;
				}

				div#main div#content {
					grid-area: questions;
				}

				div#main div#content div.button-row button {
					padding: 0.5em 1em;
				}
			`}</style>
		</div>
	);
};

export default Index;