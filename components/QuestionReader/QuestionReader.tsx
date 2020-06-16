import { activeState, answeringState, questionIndexState, readingStartState, usedQuestionsState } from '@/atoms';
import { checkAns } from '@/util';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useRecoilState } from 'recoil';
import { QuestionReaderMethods, ScoreAction, TossupQuestion, UIMode } from 'types';
import Bell from '../Bell/Bell';
import StyledButton from '../StyledButton/StyledButton';
import AnswerBox from './AnswerBox/AnswerBox';
import CompletedQuestion from './CompletedQuestion/CompletedQuestion';
import Question from './Question/Question';
import styles from './QuestionReader.module.scss';

interface Props {
	questions: TossupQuestion[];
	speed: number;
	setAllowQuery: React.Dispatch<React.SetStateAction<boolean>>;
	setMsg: React.Dispatch<React.SetStateAction<string>>;
	setTime: React.Dispatch<React.SetStateAction<number>>;
	correct: boolean;
	setCorrect: React.Dispatch<React.SetStateAction<boolean>>;
	setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
	request: () => void;
	ui_mode: UIMode;
	scoreDispatch: React.Dispatch<ScoreAction>;
}

const QuestionReader: React.ForwardRefRenderFunction<QuestionReaderMethods, Props> = (
	{ questions, speed, setAllowQuery, setMsg, request, setTime, correct, setCorrect, setTimerActive, ui_mode, scoreDispatch },
	ref
) => {
	const [questionTokens, setQuestionTokens] = useState<string[]>([]);
	const [idx, setIdx] = useState<number>(0);
	const powerIndex = questionTokens.indexOf('(*)');
	const [usedQuestions, setUsedQuestions] = useRecoilState(usedQuestionsState);
	const [active, setActive] = useRecoilState(activeState);
	const [questionFinished, setQuestionFinished] = useState<boolean>(false);
	const [answering, setAnswering] = useRecoilState(answeringState);
	const [userAnswer, setUserAnswer] = useState<string>('');
	const [questionIndex, setQuestionIndex] = useRecoilState(questionIndexState);
	const [readingStart, setReadingStart] = useRecoilState(readingStartState);

	useImperativeHandle(
		ref,
		() => ({
			endQuestion: () => {
				setActive(false);
				setQuestionFinished(true);
				setAllowQuery(true);

				const correct = checkAns(userAnswer, questions[questionIndex].answer);
				setCorrect(correct);
				if (correct) {
					if (powerIndex > idx) {
						scoreDispatch({ type: 'POWER' });
					} else {
						scoreDispatch({ type: 'TEN' });
					}
				} else if (!questionFinished) {
					scoreDispatch({ type: 'NEG' });
				}
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
				setUsedQuestions([]);
			}
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[idx, powerIndex, questionFinished, questionIndex, questions, userAnswer, setActive, setAnswering, setQuestionIndex, setUserAnswer, setUsedQuestions]
	);

	const keypressHandler = useCallback(
		(evt: KeyboardEvent) => {
			switch (evt.code) {
				case 'Space':
					if (active && !answering && evt.target === document.body) {
						setAllowQuery(false);
						setAnswering(true);
						setTimerActive(false);
						setActive(false);
					}
					break;
				case 'KeyN':
					if (!active && !answering && questionFinished && evt.target === document.body) {
						if (questionIndex !== questions.length - 1) {
							setActive(true);
							setQuestionFinished(false);
							setTimerActive(true);
							setAnswering(false);
							setUserAnswer('');
							setQuestionIndex(questionIndex + 1);
							setAllowQuery(false);
							setUsedQuestions([
								...usedQuestions,
								{ question: questions[questionIndex], buzzLocation: idx, hasPower: powerIndex !== -1, powerIndex, userAnswer }
							]);
						} else {
							setMsg('No Questions Remaining!');
						}
					}
					break;
				default:
					break;
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			active,
			answering,
			questionFinished,
			questionIndex,
			questions,
			idx,
			powerIndex,
			usedQuestions,
			userAnswer,
			setActive,
			setUsedQuestions,
			setAnswering,
			setQuestionIndex
		]
	);

	useEffect(() => {
		if (questions.length > 0) {
			if (readingStart) {
				setActive(true);
				setTimerActive(true);
				setIdx(0);
				setQuestionTokens(questions[questionIndex].text.split(' '));
				setTime(questions[questionIndex].text.split(' ').length * speed + 5000);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [questionIndex, questions, readingStart, speed, setActive]);

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
				<StyledButton type="secondary" onClick={request} size="normal" tooltip="Hotkey: L">
					Load Questions
				</StyledButton>
				<StyledButton
					onClick={() => {
						setActive(false);
						setAnswering(true);
						setAllowQuery(false);
						setTimerActive(false);
					}}
					disabled={!active || answering || questionFinished}
					type="action"
					size="normal"
					tooltip="Hotkey: B">
					<Bell height={12} width={12} /> Buzz!
				</StyledButton>
				<StyledButton
					type="primary"
					onClick={() => {
						setActive(true);
						setQuestionFinished(false);
						setQuestionIndex(questionIndex + 1);
						setUserAnswer('');
						setAllowQuery(false);
					}}
					disabled={active || answering || !questionFinished || questionIndex === questions.length - 1}
					size="normal"
					tooltip="Hotkey: N">
					Next &gt;
				</StyledButton>
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
						setAllowQuery(true);

						const correct = checkAns(userAnswer, questions[questionIndex].answer);
						setCorrect(correct);
						if (correct) {
							if (powerIndex > idx) {
								scoreDispatch({ type: 'POWER' });
							} else {
								scoreDispatch({ type: 'TEN' });
							}
						} else if (!questionFinished) {
							scoreDispatch({ type: 'NEG' });
						}
					}}
				/>
			)}
			{questions.length > 0 && readingStart && (
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
					ui_mode={ui_mode}
				/>
			)}
			{!readingStart && questions.length > 0 && (
				<div className={styles.loaded}>
					Questions Loaded!{' '}
					<StyledButton type="primary" size="big" onClick={() => setReadingStart(true)} centered>
						Start!
					</StyledButton>
				</div>
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
			{[...usedQuestions]
				.reverse()
				.map((prevQuestion, i) =>
					prevQuestion.hasPower ? (
						<CompletedQuestion
							key={i}
							powerText={prevQuestion.question.text.split(' ').slice(0, prevQuestion.powerIndex)}
							normalText={prevQuestion.question.text.split(' ').slice(prevQuestion.powerIndex + 1)}
							buzzLocation={prevQuestion.buzzLocation}
							hasPower
							original={questions[i]}
							answer={prevQuestion.userAnswer}
							ui_mode={ui_mode}
						/>
					) : (
						<CompletedQuestion
							key={i}
							normalText={prevQuestion.question.text.split(' ')}
							buzzLocation={prevQuestion.buzzLocation}
							hasPower={false}
							original={questions[i]}
							answer={prevQuestion.userAnswer}
							ui_mode={ui_mode}
						/>
					)
				)}
		</div>
	);
};

export default forwardRef(QuestionReader);
