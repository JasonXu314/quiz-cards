import { useEffect, useState } from 'react';
import styles from '../sass/Timer.module.scss';

interface Props {
	timeout: () => void;
	tick: (remaining: number) => void;
	active: boolean;
	time: number;
	dummy?: boolean;
	answerTimer?: boolean;
}

const Timer: React.FC<Props> = ({ time, active, timeout, tick, dummy = false, answerTimer = false }) => {
	const [progress, setProgress] = useState<number>(0);

	useEffect(() => {
		if (!dummy) {
			let t = 0;

			const intervalID = setInterval(() => {
				if (active) {
					t += 50;
					setProgress(t / time);
					tick(time - t < 0 ? 0 : time - t);
					if (t >= time) {
						clearInterval(intervalID);
						setProgress(1);
						timeout();
					}
				}
			}, 50);

			return () => {
				clearInterval(intervalID);
			};
		}
	}, [time, active]);

	if (dummy) {
		return (
			<div className={styles.outer}>
				<div className={styles.inner} style={{ width: '100%', height: '100%' }}></div>
			</div>
		);
	}
	return (
		<div className={styles.outer}>
			<div className={answerTimer ? `${styles.inner} ${styles.red}` : styles.inner} style={{ height: '100%', width: `${progress * 100}%` }}></div>
		</div>
	);
};

export default Timer;
