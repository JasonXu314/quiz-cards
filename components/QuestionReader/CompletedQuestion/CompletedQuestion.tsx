import { useState } from 'react';
import BuzzIcon from '../../BuzzIcon';
import PowerStar from '../../PowerStar';
import styles from './CompletedQuestion.module.scss';

interface Props {
	powerText?: string[];
	normalText?: string[];
	hasPower: boolean;
	buzzLocation: number;
	original: Question;
	answer: string;
}

const CompletedQuestion: React.FC<Props> = ({ powerText = [], normalText = [], hasPower, buzzLocation, original, answer }) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<div className={styles.main}>
			<div className={styles.info + (expanded ? '' : ' ' + styles.collapsed)} onClick={() => setExpanded(!expanded)}>
				<div>
					{original.category.name}, {original.subcategory.name}
				</div>{' '}
				| <div>{original.tournament.difficulty}</div> | <div>{original.tournament.name}</div> | <div>Round: {original.round}</div> |
				<div>Your Answer: {answer}</div> | <div>Answer: {original.answer}</div>
			</div>
			<div className={styles.question + (expanded ? '' : ' ' + styles.collapsed)}>
				{hasPower ? (
					<>
						<strong>{powerText.join(' ')}</strong>
						{normalText.length > 0 && (
							<>
								<PowerStar height={18} width={18} />
								{normalText.join(' ')}
							</>
						)}
					</>
				) : (
					<>
						{normalText.slice(0, buzzLocation).join(' ')} <BuzzIcon height={18} width={18} power={false} /> {normalText.slice(buzzLocation).join(' ')}
					</>
				)}
			</div>
		</div>
	);
};

export default CompletedQuestion;
