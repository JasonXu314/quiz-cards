interface Props {
	value: string;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
}

const AnswerBox: React.FC<Props> = ({ value, onChange, onSubmit }) => {
	return (
		<form onSubmit = {onSubmit}>
			<input type = "text" onChange = {onChange} value = {value} />
		</form>
	);
};

export default AnswerBox;