import { useCallback, useEffect, useState } from 'react';
import styles from '../sass/CardReader.module.scss';
import Card from './Card';

interface Props {
	cards: Card[];
	request: () => void;
}

const CardReader: React.FC<Props> = ({ cards, request }) => {
	const [cardIndex, setCardIndex] = useState<number>(0);
	const [cardFlipped, setCardFlipped] = useState<boolean>(false);

	const keypressHandler = useCallback(
		(evt: KeyboardEvent) => {
			switch (evt.code) {
				case 'Space':
					setCardFlipped(!cardFlipped);
					break;
				case 'KeyN':
					if (cardFlipped) {
						setCardFlipped(false);
					}
					if (cardIndex === cards.length - 1) {
						setCardIndex(0);
					} else {
						setCardIndex(cardIndex + 1);
					}
					break;
				case 'KeyB':
					if (cardFlipped) {
						setCardFlipped(false);
					}
					if (cardIndex === 0) {
						setCardIndex(cards.length - 1);
					} else {
						setCardIndex(cardIndex - 1);
					}
					break;
			}
		},
		[cards, cardFlipped, cardIndex]
	);

	useEffect(() => {
		document.addEventListener('keyup', keypressHandler);

		return () => {
			document.removeEventListener('keyup', keypressHandler);
		};
	}, [keypressHandler]);

	return (
		<div className={styles.main}>
			<div className={styles.row}>
				<button className={styles.secondary} onClick={request}>
					Load Cards
				</button>
				<button
					className={styles.secondary}
					onClick={() => {
						setCardFlipped(!cardFlipped);
						if (cardIndex === 0) {
							setCardIndex(cards.length - 1);
						} else {
							setCardIndex(cardIndex - 1);
						}
					}}
					disabled={cards.length === 0}>
					&lt; Back
				</button>
				<button
					className={styles.primary}
					onClick={() => {
						setCardFlipped(!cardFlipped);
						if (cardIndex === cards.length - 1) {
							setCardIndex(0);
						} else {
							setCardIndex(cardIndex + 1);
						}
					}}
					disabled={cards.length === 0}>
					Next &gt;
				</button>
			</div>
			{cards.length > 0 && <Card flipped={cardFlipped} setFlipped={setCardFlipped} card={cards[cardIndex]} />}
		</div>
	);
};

export default CardReader;
