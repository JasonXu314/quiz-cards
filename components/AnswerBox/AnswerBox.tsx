import Pencil from '$/Pencil';
import { useEffect, useRef } from 'react';
import styles from './AnswerBox.module.scss';

interface Props {
	value: string;
	disabled?: boolean;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
}

const AnswerBox: React.FC<Props> = ({ value, onChange, onSubmit, disabled }) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	});

	return (
		<form onSubmit={onSubmit} className={styles.main}>
			<button type="submit" className={styles.submit} disabled={disabled}>
				<Pencil height={12} width={12} /> Guess:
			</button>
			<input type="text" onChange={onChange} value={value} ref={inputRef} className={styles.input} disabled={disabled} />
		</form>
	);
};

export default AnswerBox;
