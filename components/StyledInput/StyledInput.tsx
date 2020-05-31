import styles from './StyledInput.module.scss';

interface Props {
	value: string;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
}

const StyledInput: React.FC<Props> = ({ onChange, placeholder, value }) => {
	return (
		<div className={styles.main}>
			<input className={styles.input} type="text" onChange={onChange} value={value} />
			<div className={styles.label}>{placeholder}</div>
		</div>
	);
};

export default StyledInput;
