import styles from '../sass/Chevron.module.scss';

interface Props {
	onClick?: (evt: React.MouseEvent<SVGElement, MouseEvent>) => void;
	width?: string;
	height?: string;
}

const ChevronUp: React.FC<Props> = ({ onClick, width = "24", height = "24" }) => {
	return (
		<svg xmlns = "http://www.w3.org/2000/svg" width = {width} height = {height} viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" strokeWidth = "2"
			strokeLinecap = "round" strokeLinejoin = "round" onClick = {onClick} className = {styles.main}>
			<polyline points="18 15 12 9 6 15"></polyline>
		</svg>
	);
};

export default ChevronUp;