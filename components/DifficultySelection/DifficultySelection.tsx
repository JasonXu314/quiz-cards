import { difNumToString, difNumToTags } from '../../util/constants';
import styles from './DifficultySelection.module.scss';

interface Props {
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	difficulties: number[];
}

const DifficultySelection: React.FC<Props> = ({ onChange, difficulties }) => {
	return (
		<div className={styles.main}>
			<div>Difficulty:</div>
			{new Array(9).fill(0).map((_, i) => (
				<div key={difNumToTags[i + 1]}>
					<input onChange={onChange} type="checkbox" id={difNumToTags[i + 1]} value={i + 1} checked={difficulties.includes(i + 1)} />
					<label htmlFor={difNumToTags[i + 1]}>{difNumToString[i + 1]}</label>
				</div>
			))}
		</div>
	);
};

export default DifficultySelection;
