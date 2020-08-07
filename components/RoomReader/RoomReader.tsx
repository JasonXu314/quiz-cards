import AnswerBox from '$/AnswerBox/AnswerBox';
import Bell from '$/Bell/Bell';
import CompletedQuestion from '$/CompletedQuestion/CompletedQuestion';
import Question from '$/Question/Question';
import StyledButton from '$/StyledButton/StyledButton';
import { roomPrevQuestionsState, someAnsweringState } from '@/atoms';
import { checkAns } from '@/util';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import styles from './RoomReader.module.scss';

interface Props {
	// setMsg: React.Dispatch<React.SetStateAction<string | null>>;
	setTime: React.Dispatch<React.SetStateAction<number>>;
	setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
	difficulties: Difficulty[];
	roomName: string;
	uiMode: UIMode;
	userId: string;
	roomId: string;
	speed: number;
	startTime: number | null;
	roomQuestion: TossupQuestion | null;
	socket: SocketIOClient.Socket | null;
}

const RoomReader: React.ForwardRefRenderFunction<QuestionReaderMethods, Props> = (
	{ difficulties, userId, roomId, uiMode, speed, roomName, startTime, roomQuestion, setTimerActive, setTime, socket },
	ref
) => {
	const [question, setQuestion] = useState<TossupQuestion | null>(roomQuestion);
	const [someAnswering, setSomeAnswering] = useRecoilState<boolean>(someAnsweringState);
	const [meAnswering, setMeAnswering] = useState<boolean>(false);
	const [userAnswer, setUserAnswer] = useState<string>('');
	const [correct, setCorrect] = useState<boolean>(false);
	const [idx, setIdx] = useState<number>(!startTime ? 0 : (Date.now() - startTime) / speed);
	const [questionFinished, setQuestionFinished] = useState<boolean>(!roomQuestion);
	const [readingActive, setReadingActive] = useState<boolean>(false);
	const [prevQuestions, setPrevQuestions] = useRecoilState<UsedQuestion[]>(roomPrevQuestionsState);
	const questionTokens = useMemo(() => question?.text.split(' ') || [], [question]);
	const powerIndex = useMemo(() => questionTokens.indexOf('(*)'), [questionTokens]);

	useImperativeHandle(
		ref,
		() => ({
			endQuestion: () => {
				setReadingActive(false);
				setQuestionFinished(true);

				const ansCorrect = checkAns(userAnswer, question!.answer);
				setCorrect(ansCorrect);

				if (correct) {
					if (powerIndex > idx) {
						socket?.emit('SCORE_POINT', { userId, roomId, answer: userAnswer, pointType: 'POWER' });
					} else {
						socket?.emit('SCORE_POINT', { userId, roomId, answer: userAnswer, pointType: 'TEN' });
					}
				} else if (!questionFinished) {
					socket?.emit('SCORE_POINT', { userId, roomId, answer: userAnswer, pointType: 'NEG' });
				} else {
					socket?.emit('SCORE_POINT', { userId, roomId, answer: userAnswer, pointType: 'ZERO' });
				}
			},
			performReset: () => {
				setReadingActive(false);
				setQuestionFinished(false);
				setCorrect(false);
				setIdx(0);
				setMeAnswering(false);
				setSomeAnswering(false);
				setUserAnswer('');
			}
		}),
		[userAnswer, question, correct, questionFinished, powerIndex, idx, socket, userId, roomId, setSomeAnswering]
	);

	const advanceQuestion = useCallback(() => {
		if (!readingActive && questionFinished && !someAnswering && socket) {
			socket.emit('ADVANCE_QUESTION', { roomId, difficulties });
		}
	}, [socket, difficulties, roomId, readingActive, questionFinished, someAnswering]);

	const buzz = useCallback(() => {
		if (readingActive && !someAnswering && socket) {
			socket.emit('BUZZ', { roomId, idx, userId });
		}
	}, [socket, roomId, idx, userId, readingActive, someAnswering]);

	const keypressHandler = useCallback(
		(evt: KeyboardEvent) => {
			switch (evt.code) {
				case 'KeyN':
					if (evt.target === document.body) {
						advanceQuestion();
					}
					break;
				case 'Space':
					if (evt.target === document.body) {
						buzz();
					}
					break;
				default:
					break;
			}
		},
		[advanceQuestion, buzz]
	);

	useEffect(() => {
		document.addEventListener('keyup', keypressHandler);

		const spacePreventer = (evt: KeyboardEvent) => {
			if (evt.code === 'Space' && evt.target === document.body) {
				evt.preventDefault();
			}
		};
		document.addEventListener('keydown', spacePreventer);
		document.addEventListener('keypress', spacePreventer);

		return () => {
			document.removeEventListener('keyup', keypressHandler);
			document.removeEventListener('keydown', spacePreventer);
			document.removeEventListener('keypress', spacePreventer);
		};
	}, [keypressHandler]);

	useEffect(() => {
		const intervalID = setInterval(() => {
			if (readingActive) {
				setIdx((idx) => {
					if (idx === questionTokens.length) {
						clearInterval(intervalID);
					}
					return idx + 1;
				});
			}
		}, speed);

		return () => {
			clearInterval(intervalID);
		};
	}, [speed, readingActive, questionTokens]);

	const advanceQuestionListener = useCallback(
		(evt: IQuestionAdvanceEvent) => {
			setIdx(0);
			setSomeAnswering(false);
			setMeAnswering(false);
			setReadingActive(true);
			setTimerActive(true);
			setQuestion(evt.question);
			setQuestionFinished(false);
			setUserAnswer('');
			setTime(evt.question.text.split(' ').length * speed + 5000);
			if (question) {
				setPrevQuestions((prevQuestions) => [
					...prevQuestions,
					{ buzzLocation: idx, hasPower: powerIndex !== -1, question: question, powerIndex, userAnswer }
				]);
			}
		},
		[idx, powerIndex, question, setPrevQuestions, setSomeAnswering, setTime, setTimerActive, speed, userAnswer]
	);

	const buzzListener = useCallback(
		(evt: IBuzzEvent) => {
			setIdx(evt.idx);
			setSomeAnswering(true);
			setMeAnswering(evt.userId === userId);
			setReadingActive(false);
			setTimerActive(false);
		},
		[setSomeAnswering, setTimerActive, userId]
	);

	const questionEndListener = useCallback(
		(evt: IQuestionEndEvent) => {
			setMeAnswering(false);
			setSomeAnswering(false);
			setReadingActive(false);
			setQuestionFinished(true);

			const correct = checkAns(evt.answer, question!.answer);
			setUserAnswer(evt.answer);
			setCorrect(correct);
		},
		[question, setSomeAnswering]
	);

	useEffect(() => {
		if (socket) {
			socket.on(`ROOM-${roomName}-ADVANCE_QUESTION`, advanceQuestionListener);
			socket.on(`ROOM-${roomName}-BUZZ`, buzzListener);
			socket.on(`ROOM-${roomName}-END_QUESTION`, questionEndListener);

			return () => {
				socket.off(`ROOM-${roomName}-ADVANCE_QUESTION`, advanceQuestionListener);
				socket.off(`ROOM-${roomName}-BUZZ`, buzzListener);
				socket.off(`ROOM-${roomName}-END_QUESTION`, questionEndListener);
			};
		}
	}, [socket, roomName, advanceQuestionListener, buzzListener, questionEndListener]);

	return (
		<div className={styles.main}>
			<div className={styles.row}>
				<StyledButton
					onClick={() => {
						setSomeAnswering(true);
						setMeAnswering(true);
					}}
					type="action"
					size="normal"
					tooltip="Hotkey: Space">
					<Bell height={12} width={12} /> Buzz!
				</StyledButton>
				<StyledButton
					type="primary"
					onClick={() => {
						if (!readingActive && questionFinished && !someAnswering) {
							advanceQuestion();
						}
					}}
					size="normal"
					disabled={readingActive || someAnswering || !questionFinished}
					tooltip="Hotkey: N">
					Next &gt;
				</StyledButton>
			</div>
			{someAnswering && (
				<AnswerBox
					onChange={(evt) => setUserAnswer(evt.target.value)}
					value={userAnswer}
					onSubmit={(evt) => {
						evt.preventDefault();
						setSomeAnswering(false);
						setMeAnswering(false);
						setReadingActive(false);
						setQuestionFinished(true);

						const correct = checkAns(userAnswer, question!.answer);
						setCorrect(correct);
						if (correct) {
							if (powerIndex > idx) {
								socket?.emit('SCORE_POINT', { userId, roomId, answer: userAnswer, pointType: 'POWER' });
							} else {
								socket?.emit('SCORE_POINT', { userId, roomId, answer: userAnswer, pointType: 'TEN' });
							}
						} else if (!questionFinished) {
							socket?.emit('SCORE_POINT', { userId, roomId, answer: userAnswer, pointType: 'NEG' });
						} else {
							socket?.emit('SCORE_POINT', { userId, roomId, answer: userAnswer, pointType: 'ZERO' });
						}
					}}
					disabled={!meAnswering}
				/>
			)}
			{question && (
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
					original={question}
					ui_mode={uiMode}
				/>
			)}
			{questionFinished && question && (
				<div className={styles.text}>
					<strong>Your Answer:</strong> {userAnswer}
				</div>
			)}
			{questionFinished && question && (
				<div className={styles.text + ' ' + (correct ? styles.correct : styles.incorrect)}>{correct ? 'Correct' : 'Incorrect'}</div>
			)}
			{questionFinished && question && (
				<div className={styles.text}>
					<strong>Answer:</strong> {question.answer}
				</div>
			)}
			{[...prevQuestions]
				.reverse()
				.map((prevQuestion, i) =>
					prevQuestion.hasPower ? (
						<CompletedQuestion
							key={i}
							powerText={prevQuestion.question.text.split(' ').slice(0, prevQuestion.powerIndex)}
							normalText={prevQuestion.question.text.split(' ').slice(prevQuestion.powerIndex + 1)}
							buzzLocation={prevQuestion.buzzLocation}
							hasPower
							original={prevQuestion.question}
							answer={prevQuestion.userAnswer}
							ui_mode={uiMode}
						/>
					) : (
						<CompletedQuestion
							key={i}
							normalText={prevQuestion.question.text.split(' ')}
							buzzLocation={prevQuestion.buzzLocation}
							hasPower={false}
							original={prevQuestion.question}
							answer={prevQuestion.userAnswer}
							ui_mode={uiMode}
						/>
					)
				)}
		</div>
	);
};

export default forwardRef(RoomReader);
