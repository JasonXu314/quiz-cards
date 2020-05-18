import { useState } from 'react';
import styles from '../sass/CategorySelection.module.scss';
import { categories as cats, categoryTags as tags } from '../util/constants';
import ChevronDown from './ChevronDown';
import ChevronUp from './ChevronUp';

interface Props {
	dispatch: React.Dispatch<string>;
	subcatDispatch: React.Dispatch<string>;
	categories: string[];
	subcategories: string[];
}

const CategorySelection: React.FC<Props> = ({ dispatch, subcatDispatch, categories, subcategories }) => {
	const [expanded, setExpanded] = useState<boolean>(true);

	return (
		<div className={styles.main}>
			<h4>Categories {expanded ? <ChevronUp onClick={() => setExpanded(false)} /> : <ChevronDown onClick={() => setExpanded(true)} />}</h4>
			{expanded && (
				<>
					{cats.map((category, i) => (
						<div key={tags[i]}>
							<input
								onChange={() => {
									if (categories.includes(category)) {
										subcategories.forEach((subcat) => {
											if (subcat.startsWith(category)) {
												subcatDispatch(subcat);
											}
										});
									}
									dispatch(category);
								}}
								type="checkbox"
								id={tags[i]}
								value={category}
								checked={categories.includes(category)}
							/>
							<label htmlFor={tags[i]}>{category}</label>
						</div>
					))}
				</>
			)}

			<style jsx>{`
				div div input {
					transform: translate(0, 12.5%);
				}

				div div label {
					user-select: none;
				}
			`}</style>
		</div>
	);
};

export default CategorySelection;
