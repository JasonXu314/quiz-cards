import { useState } from 'react';
import BuzzIcon from '../../BuzzIcon';
import PowerStar from '../../PowerStar/PowerStar';
import styles from './CompletedQuestion.module.scss';

interface Props {
	powerText?: string[];
	normalText?: string[];
	hasPower: boolean;
	buzzLocation: number;
	original: TossupQuestion;
	answer: string;
	ui_mode: UIMode;
}

const CompletedQuestion: React.FC<Props> = ({ powerText = [], normalText = [], hasPower, buzzLocation, original, answer, ui_mode }) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	return ui_mode === 'protobowl' ? (
		<div className={`${styles.main} ${styles.protobowl}`}>
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
	) : (
		<div className={`${styles.main} ${styles.tabled}`}>
			<div className={styles.info + (expanded ? '' : ' ' + styles.collapsed)} onClick={() => setExpanded(!expanded)}>
				<div className={styles.row}>
					<h4>Category:</h4>
					<div>{original.category.name}</div>
				</div>
				<div className={styles.row}>
					<h4>Difficulty:</h4>
					<div>{original.tournament.difficulty}</div>
				</div>
				<div className={styles.row}>
					<h4>Tournament:</h4>
					<div>{original.tournament.name}</div>
				</div>
				<div className={styles.row}>
					<h4>Round:</h4>
					<div>{original.round}</div>
				</div>
				<div className={styles.row}>
					<h4>Your Answer:</h4>
					<div>{answer}</div>
				</div>
				<div className={styles.row}>
					<h4>Answer:</h4>
					<div>{original.answer}</div>
				</div>
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
