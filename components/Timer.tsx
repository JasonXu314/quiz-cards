import { useEffect, useState } from "react";

interface Props {
	timeout: () => void;
	active: boolean;
	time: number;
}

const Timer: React.FC<Props> = ({ time, active, timeout }) => {
	const [progress, setProgress] = useState<number>(0);

	useEffect(() => {
		let t = 0;
		
		const intervalID = setInterval(() => {
			if (active) {
				t += 50;
				setProgress(t/time);
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
	}, [time, active])
	
	return (
		<progress value = {progress} max = "1" />
	);
};

export default Timer;