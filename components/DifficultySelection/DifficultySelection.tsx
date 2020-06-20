import { difNumToString, difNumToTags } from '@/constants';
import { Difficulty } from 'types';
import styles from './DifficultySelection.module.scss';

interface Props {
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	difficulties: Difficulty[];
}

const DifficultySelection: React.FC<Props> = ({ onChange, difficulties }) => {
	return (
		<div className={styles.main}>
			<div>Difficulty:</div>
			{new Array(9).fill(0).map((_, i) => (
				<div key={difNumToTags[(i + 1) as Difficulty]}>
					<input
						onChange={onChange}
						type="checkbox"
						id={difNumToTags[(i + 1) as Difficulty]}
						value={i + 1}
						checked={difficulties.includes((i + 1) as Difficulty)}
					/>
					<label htmlFor={difNumToTags[(i + 1) as Difficulty]}>{difNumToString[(i + 1) as Difficulty]}</label>
				</div>
			))}
		</div>
	);
};

export default DifficultySelection;
