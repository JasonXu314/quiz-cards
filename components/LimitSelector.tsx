import { AppMode } from 'types';
import styles from '../sass/LimitSelector.module.scss';

interface Props {
	onLimitChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	onLimitBlur: (evt: React.FocusEvent<HTMLInputElement>) => void;
	onUseLimitChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	limit: number;
	useLimit: boolean;
	mode: AppMode;
}

const LimitSelector: React.FC<Props> = ({ limit, mode, useLimit, onUseLimitChange, onLimitChange, onLimitBlur }) => {
	return (
		<div className={styles.main}>
			{mode === 'read' ? (
				<>
					<label className={styles.limit} htmlFor="limit">
						Question Limit:
					</label>
					<input className={styles.limit} onChange={onLimitChange} onBlur={onLimitBlur} id="limit" type="text" value={Number.isNaN(limit) ? '' : limit} />
				</>
			) : (
				<>
					<label>Limit Cards?</label>
					<label className={useLimit ? `${styles.switch} ${styles.checked}` : `${styles.switch}`}>
						<input type="checkbox" checked={useLimit} onChange={onUseLimitChange} />
						<span></span>
					</label>
					<br />
					<label className={styles.limit} htmlFor="limit">
						Card Limit:
					</label>
					<input
						className={styles.limit}
						onChange={onLimitChange}
						onBlur={onLimitBlur}
						id="limit"
						type="text"
						value={Number.isNaN(limit) ? '' : limit}
						disabled={!useLimit}
					/>
				</>
			)}
		</div>
	);
};

export default LimitSelector;
