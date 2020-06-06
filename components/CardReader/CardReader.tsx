import { useCallback, useEffect, useState } from 'react';
import StyledButton from '../StyledButton/StyledButton';
import Card from './Card/Card';
import styles from './CardReader.module.scss';

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
				<StyledButton type="secondary" onClick={request} tooltip="Hotkey: L" size="normal">
					Load Cards
				</StyledButton>
				<StyledButton
					type="secondary"
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
					tooltip="Hotkey: B"
					size="normal">
					&lt; Back
				</StyledButton>
				<StyledButton
					type="primary"
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
					tooltip="Hotkey: N"
					size="normal">
					Next &gt;
				</StyledButton>
			</div>
			{cards.length > 0 && <Card flipped={cardFlipped} setFlipped={setCardFlipped} card={cards[cardIndex]} />}
		</div>
	);
};

export default CardReader;
