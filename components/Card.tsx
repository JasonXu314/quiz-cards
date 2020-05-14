import Link from "next/link";
import { useState } from "react";
import styles from '../sass/Card.module.scss';

interface Props {
	card: Card;
}

const Card: React.FC<Props> = ({ card }) => {
	const [flipped, setFlipped] = useState<boolean>(false);
	
	return (
		<div className = {styles.main}>
			<div className = {styles.information}>
				<h3>Category: </h3>{card.category}
				<h3>Subcategory:</h3>{card.subcategory === null ? 'N/A' : card.subcategory}
				<Link href = "/edit/[_id]" as = {`/edit/${card._id}`}>
					<a rel = "noopener noreferrer" target = "_blank">Edit this card</a>
				</Link>
			</div>
			<div onClick = {() => setFlipped(!flipped)} className = {styles.content}>
				{flipped ? <h2>{card.answer}</h2> : <h1>{card.hint}</h1>}
			</div>
		</div>
	);
};

export default Card;