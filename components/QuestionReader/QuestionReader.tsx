import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { answeringState } from '../../util/atoms';
import { checkAns } from '../../util/util';
import AnswerBox from '../AnswerBox';
import Bell from '../Bell';
import CompletedQuestion from './CompletedQuestion/CompletedQuestion';
import Question from './Question/Question';
import styles from './QuestionReader.module.scss';

interface Props {
	questions: Question[];
	speed: number;
	setAllowQuery: React.Dispatch<React.SetStateAction<boolean>>;
	setMsg: React.Dispatch<React.SetStateAction<string>>;
	setTime: React.Dispatch<React.SetStateAction<number>>;
	correct: boolean;
	setCorrect: React.Dispatch<React.SetStateAction<boolean>>;
	setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
	request: () => void;
}

const QuestionReader: React.RefForwardingComponent<QuestionReaderMethods, Props> = (
	{ questions, speed, setAllowQuery, setMsg, request, setTime, correct, setCorrect, setTimerActive },
	ref
) => {
	const [questionTokens, setQuestionTokens] = useState<string[]>([]);
	const [idx, setIdx] = useState<number>(0);
	const powerIndex = questionTokens.indexOf('(*)');
	const questionRef = useRef<UsedQuestion[]>([]);
	const [active, setActive] = useState<boolean>(false);
	const [questionFinished, setQuestionFinished] = useState<boolean>(false);
	const [answering, setAnswering] = useRecoilState(answeringState);
	const [userAnswer, setUserAnswer] = useState<string>('');
	const [questionIndex, setQuestionIndex] = useState<number>(0);
	const [tooltipShown, setTooltipShown] = useState<string>(null);

	useImperativeHandle(ref, () => ({
		endQuestion: () => {
			setActive(false);
			setQuestionFinished(true);
			setCorrect(checkAns(userAnswer, questions[questionIndex].answer));
		},
		performReset: () => {
			setActive(false);
			setQuestionFinished(false);
			setCorrect(false);
			setIdx(0);
			setQuestionTokens([]);
			setAnswering(false);
			setQuestionIndex(0);
			setUserAnswer('');
			questionRef.current = [];
		}
	}));

	const keypressHandler = useCallback(
		(evt: KeyboardEvent) => {
			switch (evt.code) {
				case 'Space':
					if (active && !answering) {
						setAllowQuery(false);
						setAnswering(true);
						setTimerActive(false);
						setActive(false);
					}
					break;
				case 'KeyN':
					if (!active && !answering && questionFinished) {
						if (questionIndex !== questions.length - 1) {
							setActive(true);
							setQuestionFinished(false);
							setTimerActive(true);
							setAnswering(false);
							setUserAnswer('');
							setQuestionIndex(questionIndex + 1);
							setAllowQuery(false);
							questionRef.current.push({ question: questions[questionIndex], buzzLocation: idx, hasPower: powerIndex !== -1, powerIndex, userAnswer });
						} else {
							setMsg('No Questions Remaining!');
						}
					}
					break;
				default:
					break;
			}
		},
		[active, answering, questionFinished, questionIndex, questions]
	);

	useEffect(() => {
		if (questions.length > 0) {
			setIdx(0);
			setQuestionTokens(questions[questionIndex].text.split(' '));
			setActive(true);
			setTimerActive(true);
			setTime(questions[questionIndex].text.split(' ').length * speed + 5000);
		}
	}, [questionIndex, questions]);

	useEffect(() => {
		const intervalID = setInterval(() => {
			if (active) {
				setIdx(idx + 1);
				if (idx === questionTokens.length) {
					clearInterval(intervalID);
				}
			}
		}, speed);

		return () => {
			clearInterval(intervalID);
		};
	}, [speed, active, idx, questionTokens]);

	useEffect(() => {
		document.addEventListener('keyup', keypressHandler);

		const spacePreventer = (evt: KeyboardEvent) => {
			if (evt.code === 'Space' && evt.target === document.body) {
				evt.preventDefault();
			}
		};
		document.addEventListener('keydown', spacePreventer);

		return () => {
			document.removeEventListener('keyup', keypressHandler);
			document.removeEventListener('keydown', spacePreventer);
		};
	}, [keypressHandler]);

	return (
		<div className={styles.main}>
			<div className={styles.row}>
				<button className={styles.secondary} onClick={request} onMouseEnter={() => setTooltipShown('load')} onMouseLeave={() => setTooltipShown(null)}>
					Load Questions
				</button>
				<button
					className={styles.action}
					onClick={() => {
						setActive(false);
						setAnswering(true);
						setAllowQuery(false);
					}}
					disabled={!active || answering || questionFinished}
					onMouseEnter={() => setTooltipShown('buzz')}
					onMouseLeave={() => setTooltipShown(null)}>
					<Bell height={12} width={12} /> Buzz!
				</button>
				<button
					className={styles.primary}
					onClick={() => {
						setActive(true);
						setQuestionFinished(false);
						setQuestionIndex(questionIndex + 1);
						setUserAnswer('');
						setAllowQuery(false);
					}}
					disabled={active || answering || !questionFinished || questionIndex === questions.length - 1}
					onMouseEnter={() => setTooltipShown('next')}
					onMouseLeave={() => setTooltipShown(null)}>
					Next &gt;
				</button>
			</div>
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
						setAllowQuery(true);
					}}
				/>
			)}
			{questions.length > 0 && (
				<Question
					powerText={
						powerIndex === -1
							? []
							: questionFinished
							? questionTokens.slice(0, powerIndex)
							: questionTokens.slice(0, idx > powerIndex ? powerIndex : idx)
					}
					normalText={
						powerIndex === -1
							? questionFinished
								? questionTokens
								: questionTokens.slice(0, idx)
							: questionTokens.slice(powerIndex + 1, questionFinished ? questionTokens.length : idx)
					}
					hasPower={powerIndex !== -1}
					original={questions[questionIndex]}
				/>
			)}
			{questionFinished && (
				<div className={styles.text}>
					<strong>Your Answer:</strong> {userAnswer}
				</div>
			)}
			{questionFinished && <div className={styles.text + ' ' + (correct ? styles.correct : styles.incorrect)}>{correct ? 'Correct' : 'Incorrect'}</div>}
			{questionFinished && (
				<div className={styles.text}>
					<strong>Answer:</strong> {questions[questionIndex].answer}
				</div>
			)}
			{questionRef.current.map((prevQuestion, i) =>
				prevQuestion.hasPower ? (
					<CompletedQuestion
						key={i}
						powerText={prevQuestion.question.text.split(' ').slice(0, prevQuestion.powerIndex)}
						normalText={prevQuestion.question.text.split(' ').slice(prevQuestion.powerIndex + 1)}
						buzzLocation={prevQuestion.buzzLocation}
						hasPower
						original={questions[i]}
						answer={prevQuestion.userAnswer}
					/>
				) : (
					<CompletedQuestion
						key={i}
						normalText={prevQuestion.question.text.split(' ')}
						buzzLocation={prevQuestion.buzzLocation}
						hasPower={false}
						original={questions[i]}
						answer={prevQuestion.userAnswer}
					/>
				)
			)}
			<div className={tooltipShown === 'load' ? `${styles.tooltip} ${styles.load} ${styles.shown}` : `${styles.tooltip} ${styles.load}`}>Hotkey: L</div>
			<div className={tooltipShown === 'buzz' ? `${styles.tooltip} ${styles.buzz} ${styles.shown}` : `${styles.tooltip} ${styles.buzz}`}>Hotkey: B</div>
			<div className={tooltipShown === 'next' ? `${styles.tooltip} ${styles.next} ${styles.shown}` : `${styles.tooltip} ${styles.next}`}>Hotkey: N</div>
		</div>
	);
};

export default forwardRef(QuestionReader);
