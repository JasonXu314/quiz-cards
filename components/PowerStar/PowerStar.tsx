import styles from './PowerStar.module.scss';

interface Props {
	height: number;
	width: number;
}

const PowerStar: React.FC<Props> = ({ height, width }) => {
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
			className={styles.outer}>
			<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
		</svg>
	);
};

export default PowerStar;
