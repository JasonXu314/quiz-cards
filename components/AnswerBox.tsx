import { useEffect, useRef } from "react";

interface Props {
	value: string;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
}

const AnswerBox: React.FC<Props> = ({ value, onChange, onSubmit }) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current.focus();
	});
	
	return (
		<form onSubmit = {onSubmit}>
			<input type = "text" onChange = {onChange} value = {value} ref = {inputRef} />
		</form>
	);
};

export default AnswerBox;