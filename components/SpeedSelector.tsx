import styles from '../sass/SpeedSelector.module.scss';

interface Props {
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: (evt: React.FocusEvent<HTMLInputElement>) => void;
	speed: number;
}

const SpeedSelector: React.FC<Props> = ({ onChange, onBlur, speed }) => {
	return (
		<div className={styles.main}>
			<label htmlFor="speed">Reading Speed:</label>
			<input onChange={onChange} onBlur={onBlur} id="speed" type="text" value={Number.isNaN(speed) ? '' : speed} />
		</div>
	);
};

export default SpeedSelector;
