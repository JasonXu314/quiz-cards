import { useState } from "react";
import styles from '../sass/Card.module.scss';

interface Props {
	card: Card;
}

const Card: React.FC<Props> = ({ card }) => {
	const [flipped, setFlipped] = useState<boolean>(false);
	
	return (
		<div onClick = {() => setFlipped(!flipped)} className = {styles.main}>
			{flipped ? <h2>{card.answer}</h2> : <h1>{card.hint}</h1>}
		</div>
	);
};

export default Card;