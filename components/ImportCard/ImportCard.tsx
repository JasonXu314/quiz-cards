import { categories } from '@/constants';
import { memo, useState } from 'react';
import styles from './ImportCard.module.scss';

interface Props {
	card: IProtoCard;
	dispatch: React.Dispatch<ImportCardReducerAction>;
	index: number;
}

const ImportCard: React.FC<Props> = memo(
	({ card, dispatch, index }) => {
		const [category, setCategory] = useState<Category>(card.category);
		const [subcategory, setSubcategory] = useState<Subcategory | null>(card.subcategory);

		return (
			<div className={styles.main}>
				<h4 className={styles.hint}>{card.hint}</h4>
				<p className={styles.answer}>{card.answer}</p>
				<p className={styles.author}>By: {card.author}</p>
				<select
					className={styles.category}
					value={category}
					onChange={(evt) => {
						const newCategory = evt.target.value as Category;
						setCategory(newCategory);
						dispatch({ type: 'CATEGORY', i: index, category: newCategory });
					}}>
					{categories.entries.map(([categoryName, category]) => (
						<option key={category.id} value={categoryName}>
							{categoryName}
						</option>
					))}
				</select>
				<select
					className={styles.subcategory}
					value={subcategory || ''}
					onChange={(evt) => {
						const newSubategory = evt.target.value as Subcategory;
						setSubcategory(newSubategory);
						dispatch({ type: 'SUBCATEGORY', i: index, subcategory: newSubategory });
					}}>
					<option value=""></option>
					{Object.entries(categories[category].subcategories).map(([subcategoryName, subcategory]) => (
						<option key={subcategory.id} value={subcategoryName}>
							{subcategoryName}
						</option>
					))}
				</select>
			</div>
		);
	},
	(prev, next) => prev.dispatch === next.dispatch && Object.is(prev.card, next.card)
);

export default ImportCard;
