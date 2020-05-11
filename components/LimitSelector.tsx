import styles from '../sass/LimitSelector.module.scss';

interface Props {
	setLimit: React.Dispatch<React.SetStateAction<number>>;
	limit: number;
}

const LimitSelector: React.FC<Props> = ({ setLimit, limit }) => {
	return (
		<div className = {styles.main}>
			<label htmlFor = "limit">Question Limit:</label>
			<input onChange = {(evt) => {
				if (/-?(\d*|\d*\.\d*|\.\d*)([eE][-+]?\d*)?/.test(evt.target.value)) {
					setLimit(evt.target.value === '' ? NaN : parseInt(evt.target.value));
				}
			}} onBlur = {(evt) => {
				if (evt.target.value === '') {
					setLimit(1);
				}
				else if (parseInt(evt.target.value) > 150) {
					setLimit(150);
				}
			}} id = "limit" type = "text" value = {Number.isNaN(limit)  ? '' : limit} />
		</div>
	);
};

export default LimitSelector;