import { useCallback, useEffect, useState } from 'react';
import Card from './Card/Card';
import styles from './CardReader.module.scss';

interface Props {
	cards: Card[];
	request: () => void;
}

const CardReader: React.FC<Props> = ({ cards, request }) => {
	const [cardIndex, setCardIndex] = useState<number>(0);
	const [cardFlipped, setCardFlipped] = useState<boolean>(false);
	const [tooltipShown, setTooltipShown] = useState<string>(null);

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
				<button className={styles.secondary} onClick={request} onMouseEnter={() => setTooltipShown('load')} onMouseLeave={() => setTooltipShown(null)}>
					Load Cards
				</button>
				<button
					className={styles.secondary}
					onClick={() => {
						if (cardFlipped) {
							setCardFlipped(false);
						}
						if (cardIndex === 0) {
							setCardIndex(cards.length - 1);
						} else {
							setCardIndex(cardIndex - 1);
						}
					}}
					disabled={cards.length === 0}
					onMouseEnter={() => setTooltipShown('back')}
					onMouseLeave={() => setTooltipShown(null)}>
					&lt; Back
				</button>
				<button
					className={styles.primary}
					onClick={() => {
						if (cardFlipped) {
							setCardFlipped(false);
						}
						if (cardIndex === cards.length - 1) {
							setCardIndex(0);
						} else {
							setCardIndex(cardIndex + 1);
						}
					}}
					disabled={cards.length === 0}
					onMouseEnter={() => setTooltipShown('next')}
					onMouseLeave={() => setTooltipShown(null)}>
					Next &gt;
				</button>
			</div>
			{cards.length > 0 && <Card flipped={cardFlipped} setFlipped={setCardFlipped} card={cards[cardIndex]} />}
			<div className={tooltipShown === 'load' ? `${styles.tooltip} ${styles.load} ${styles.shown}` : `${styles.tooltip} ${styles.load}`}>Hotkey: L</div>
			<div className={tooltipShown === 'back' ? `${styles.tooltip} ${styles.back} ${styles.shown}` : `${styles.tooltip} ${styles.back}`}>Hotkey: B</div>
			<div className={tooltipShown === 'next' ? `${styles.tooltip} ${styles.next} ${styles.shown}` : `${styles.tooltip} ${styles.next}`}>Hotkey: N</div>
		</div>
	);
};

export default CardReader;
