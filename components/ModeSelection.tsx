import { AppMode } from 'types';

interface Props {
	mode: AppMode;
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

const ModeSelection: React.FC<Props> = ({ onChange, mode }) => {
	return (
		<div>
			<div>
				<input id="card" type="radio" value="card" checked={mode === 'card'} onChange={onChange} />
				<label htmlFor="card">Flashcards</label>
			</div>
			<div>
				<input id="read" type="radio" value="read" checked={mode === 'read'} onChange={onChange} />
				<label htmlFor="read">Read Questions</label>
			</div>
		</div>
	);
};

export default ModeSelection;
