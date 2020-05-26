import PowerStar from '../../PowerStar';
import styles from './Question.module.scss';

interface Props {
	powerText?: string[];
	normalText?: string[];
	hasPower: boolean;
	original: Question;
}

const Question: React.FC<Props> = ({ powerText = [], normalText = [], hasPower, original }) => {
	return (
		<div className={styles.main}>
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
	);
};

export default Question;
