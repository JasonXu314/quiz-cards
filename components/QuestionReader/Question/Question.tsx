import PowerStar from '$/PowerStar/PowerStar';
import { TossupQuestion, UIMode } from 'types';
import styles from './Question.module.scss';

interface Props {
	powerText?: string[];
	normalText?: string[];
	hasPower: boolean;
	original: TossupQuestion;
	ui_mode: UIMode;
}

const Question: React.FC<Props> = ({ powerText = [], normalText = [], hasPower, original, ui_mode }) => {
	return ui_mode === 'protobowl' ? (
		<div className={`${styles.main} ${styles.protobowl}`}>
			<div className={styles.info}>
				<div>{original.category.name}</div>
				<div>{original.tournament.difficulty}</div>
				<div>{original.tournament.name}</div>
				<div>Round: {original.round}</div>
			</div>
			<div className={styles.question}>
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
					normalText.join(' ')
				)}
			</div>
		</div>
	) : (
		<div className={`${styles.main} ${styles.tabled}`}>
			<div className={styles.info}>
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
			</div>
			<div className={styles.question}>
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
					normalText.join(' ')
				)}
			</div>
		</div>
	);
};

export default Question;
