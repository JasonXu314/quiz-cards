import Link from 'next/link';
import { ICard } from 'types';
import styles from './Card.module.scss';

interface Props {
	card: ICard;
	setFlipped: React.Dispatch<React.SetStateAction<boolean>>;
	flipped: boolean;
}

const Card: React.FC<Props> = ({ card, setFlipped, flipped }) => {
	return (
		<div className={styles.main}>
			<div className={styles.information}>
				<h3>Category: </h3>
				{card.category}
				<h3>Subcategory:</h3>
				{card.subcategory || 'N/A'}
				<Link href="/edit/[_id]" as={`/edit/${card._id}`}>
					<a rel="noopener noreferrer" target="_blank">
						Edit this card
					</a>
				</Link>
				<h3>Author:</h3>
				{card.author || 'N/A'}
			</div>
			<div onClick={() => setFlipped(!flipped)} className={styles.content}>
				{flipped ? <h2>{card.answer}</h2> : <h1>{card.hint}</h1>}
			</div>
		</div>
	);
};

export default Card;
