import { useState } from 'react';
import styles from './StyledButton.module.scss';

interface Props {
	onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
	type: 'action' | 'primary' | 'secondary';
	size: 'normal' | 'big' | 'bigger';
	tooltip?: string;
	centered?: boolean;
	disabled?: boolean;
}

const StyledButton: React.FC<React.PropsWithChildren<Props>> = ({ onClick, type, size, tooltip, children, centered, disabled }) => {
	const [tooltipShown, setTooltipShown] = useState<boolean>(false);

	return (
		<div className={styles.main}>
			<button
				className={`${styles.button} ${styles[type]}` + (centered ? ` ${styles.center}` : '') + (size !== 'normal' ? ` ${styles[size]}` : '')}
				onClick={(evt) => {
					onClick(evt);
					setTooltipShown(false);
				}}
				disabled={disabled}
				onMouseEnter={() => setTooltipShown(true)}
				onMouseLeave={() => setTooltipShown(false)}>
				{children}
			</button>
			{tooltip && <div className={styles.tooltip + (tooltipShown ? ` ${styles.shown}` : '')}>{tooltip}</div>}
		</div>
	);
};

export default StyledButton;
