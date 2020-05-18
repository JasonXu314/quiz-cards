import { useEffect, useState } from 'react';
import styles from '../sass/QuestionReader.module.scss';

interface Props {
	question: Question;
	speed: number;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	active: boolean;
	questionFinished: boolean;
	correct: boolean;
}

const QuestionReader: React.FC<Props> = ({ question, speed, active, questionFinished, correct }) => {
	const [questionText, setQuestionText] = useState<string>('');

	useEffect(() => {
		let idx = 0;
		const intervalID = setInterval(() => {
			if (active) {
				idx++;
				setQuestionText(question.text.split(' ').slice(0, idx).join(' '));
				if (idx === question.text.split(' ').length) {
					clearInterval(intervalID);
				}
			}
		}, speed);

		return () => {
			clearInterval(intervalID);
		};
	}, [speed, active, question]);

	return (
		<div className={styles.main}>
			<div>{questionFinished ? question.text : questionText}</div>
			{questionFinished && <div>Answer: {question.answer}</div>}
			{questionFinished && <div className={correct ? styles.correct : styles.incorrect}>{correct ? 'Correct' : 'Incorrect'}</div>}
		</div>
	);
};

export default QuestionReader;
