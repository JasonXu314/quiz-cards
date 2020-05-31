import { memo, useState } from 'react';
import { categories, categoryTags, catToSubcat, catToTags } from '../../util/constants';
import styles from './ImportCard.module.scss';

interface Props {
	card: ProtoCard;
	dispatch: React.Dispatch<ImportCardReducerAction>;
	index: number;
}

const ImportCard: React.FC<Props> = memo(
	({ card, dispatch, index }) => {
		const [category, setCategory] = useState<string>(card.category);
		const [subcategory, setSubcategory] = useState<string>(card.subcategory);

		return (
			<div className={styles.main}>
				<h4 className={styles.hint}>{card.hint}</h4>
				<p className={styles.answer}>{card.answer}</p>
				<p className={styles.author}>By: {card.author}</p>
				<select
					className={styles.category}
					value={category}
					onChange={(evt) => {
						setCategory(evt.target.value);
						dispatch({ type: 'CATEGORY', i: index, category: evt.target.value });
					}}>
					{categories.map((category, i) => (
						<option key={categoryTags[i]} value={category}>
							{category}
						</option>
					))}
				</select>
				<select
					className={styles.subcategory}
					value={subcategory}
					onChange={(evt) => {
						setSubcategory(evt.target.value);
						dispatch({ type: 'SUBCATEGORY', i: index, subcategory: evt.target.value });
					}}>
					<option value=""></option>
					{catToSubcat[card.category].map((subcat: string, i: number) => (
						<option key={catToTags[card.category][i]} value={subcat}>
							{subcat}
						</option>
					))}
				</select>
			</div>
		);
	},
	(prev, next) => prev.dispatch === next.dispatch && Object.is(prev.card, next.card)
);

export default ImportCard;
