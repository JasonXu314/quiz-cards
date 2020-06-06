import styles from './UIModeSelector.module.scss';

interface Props {
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	ui_mode: UIMode;
}

const UIModeSelector: React.FC<Props> = ({ onChange, ui_mode }) => {
	return (
		<div className={styles.main}>
			<h4>UI Mode:</h4>
			<div className={styles.row}>
				<div className={styles.group}>
					<input type="radio" id="ui-mode-protobowl" value="protobowl" checked={ui_mode === 'protobowl'} onChange={onChange} />
					<label htmlFor="ui-mode-protobowl">Protobowl</label>
				</div>
				<div className={styles.group}>
					<input type="radio" id="ui-mode-tabled" value="tabled" checked={ui_mode === 'tabled'} onChange={onChange} />
					<label htmlFor="ui-mode-tabled">Tabled</label>
				</div>
			</div>
		</div>
	);
};

export default UIModeSelector;
