import StyledButton from '$/StyledButton/StyledButton';
import { categories } from '@/constants';
import { useCallback, useState } from 'react';
import styles from './DistroModal.module.scss';

interface Props {
	distro: Record<Category, number>;
	save: (distro: Record<Category, number>) => void;
	close: () => void;
}

const DistroModal: React.FC<Props> = ({ distro, save, close }) => {
	const [newDistro, setNewDistro] = useState<Record<Category, number>>(distro);
	const [err, setErr] = useState<string | null>(null);

	const validate = useCallback(() => {
		const sum = Object.entries(newDistro).reduce((total, [, val]) => total + val, 0);

		if (sum !== 100) {
			setErr('Percentages do not add up to 100%');
		}
	}, [newDistro]);

	return (
		<div className={styles.main}>
			{categories.entries.map(([categoryName, category]) => (
				<div key={category.id} className={styles.category}>
					<span>{categoryName}: </span>
					<span className={styles.percentageWrapper}>
						<input
							className={styles.percentage}
							value={Number.isNaN(newDistro[categoryName]) ? '' : newDistro[categoryName]}
							onChange={(evt) => {
								if (/(\d*|\d*\.\d*|\.\d*)/.test(evt.target.value)) {
									setNewDistro({ ...newDistro, [categoryName]: parseInt(evt.target.value) });
									setErr(null);
								}
							}}
							onBlur={validate}
						/>
						%
					</span>
				</div>
			))}
			{err && <div className={styles.error}>{err}</div>}
			<div className={styles.row}>
				<StyledButton
					onClick={() => {
						if (!err) {
							save(newDistro);
						}
					}}
					size="normal"
					type="primary">
					Save
				</StyledButton>
				<StyledButton onClick={close} size="normal" type="action">
					Cancel
				</StyledButton>
			</div>
		</div>
	);
};

export default DistroModal;
