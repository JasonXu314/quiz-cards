import styles from '../sass/LimitSelector.module.scss';

interface Props {
	setLimit: React.Dispatch<React.SetStateAction<number>>;
	limit: number;
	setUseLimit: React.Dispatch<React.SetStateAction<boolean>>;
	useLimit: boolean;
	mode: AppMode;
}

const LimitSelector: React.FC<Props> = ({ setLimit, limit, mode, useLimit, setUseLimit }) => {
	return (
		<div className = {styles.main}>
			{mode === 'read' ? <>
				<label className = {styles.limit} htmlFor = "limit">Question Limit:</label>
				<input className = {styles.limit} onChange = {(evt) => {
					if (/\d*/.test(evt.target.value)) {
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
			</> : <>
				<label>Limit Cards?</label>
				<label className = {useLimit ? `${styles.switch} ${styles.checked}` : `${styles.switch}`}>
					<input type = "checkbox" checked = {useLimit} onChange = {(evt) => setUseLimit(evt.target.checked)} />
					<span></span>
				</label><br />
				<label className = {styles.limit} htmlFor = "limit">Card Limit:</label>
				<input className = {styles.limit} onChange = {(evt) => {
					if (/\d*/.test(evt.target.value)) {
						setLimit(evt.target.value === '' ? NaN : parseInt(evt.target.value));
					}
				}} onBlur = {(evt) => {
					if (evt.target.value === '') {
						setLimit(1);
					}
					else if (parseInt(evt.target.value) > 150) {
						setLimit(250);
					}
				}} id = "limit" type = "text" value = {Number.isNaN(limit)  ? '' : limit} disabled = {!useLimit} />
			</>}
		</div>
	);
};

export default LimitSelector;