interface Props {
	mode: AppMode;
	setMode: React.Dispatch<React.SetStateAction<AppMode>>;
}

const ModeSelection: React.FC<Props> = ({ setMode, mode }) => {
	return (
		<div>
			<div>
				<input id = "card" type = "radio" value = "card" checked = {mode === 'card'} onChange = {() => setMode('card')} />
				<label htmlFor = "card">Flashcards</label>
			</div>
			<div>
				<input id = "read" type = "radio" value = "read" checked = {mode === 'read'} onChange = {() => setMode('read')} />
				<label htmlFor = "read">Read Questions</label>
			</div>
		</div>
	);
};

export default ModeSelection;