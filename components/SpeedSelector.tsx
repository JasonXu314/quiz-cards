import styles from '../sass/SpeedSelector.module.scss';

interface Props {
	setSpeed: React.Dispatch<React.SetStateAction<number>>;
	speed: number;
}

const SpeedSelector: React.FC<Props> = ({ setSpeed, speed }) => {
	return (
		<div className = {styles.main}>
			<label htmlFor = "speed">Reading Speed:</label>
			<input onChange = {(evt) => {
				if (/-?(\d*|\d*\.\d*|\.\d*)([eE][-+]?\d*)?/.test(evt.target.value)) {
					setSpeed(evt.target.value === '' ? NaN : parseInt(evt.target.value));
				}
			}} onBlur = {(evt) => {
				if (evt.target.value === '' || parseInt(evt.target.value) < 10) {
					setSpeed(10);
				}
				else if (parseInt(evt.target.value) > 1000) {
					setSpeed(1000);
				}
			}} id = "speed" type = "text" value = {Number.isNaN(speed) ? '' : speed} />
		</div>
	);
};

export default SpeedSelector;