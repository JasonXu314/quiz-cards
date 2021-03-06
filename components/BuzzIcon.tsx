import styles from '../sass/BuzzIcon.module.scss';

interface Props {
	height: number;
	width: number;
	power: boolean;
}

const BuzzIcon: React.FC<Props> = ({ height, width, power }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={height}
			height={width}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${styles.outer} ${power ? styles.gray : styles.red}`}>
			<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
			<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
		</svg>
	);
};

export default BuzzIcon;
