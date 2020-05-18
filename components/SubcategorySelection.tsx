import { useEffect, useReducer } from 'react';
import { categories as cats, categoryTags, catToSubcat, catToTags } from '../util/constants';
import ChevronDown from './ChevronDown';
import ChevronUp from './ChevronUp';

interface Props {
	dispatch: React.Dispatch<string>;
	categories: string[];
	subcategories: string[];
}

const reducer: React.Reducer<{ [key: string]: boolean }, string> = (map, category) => {
	return {
		...map,
		[category]: !map[category]
	};
};

const initialState = Object.fromEntries(cats.map((category) => [category, false]));

const SubcategorySelection: React.FC<Props> = ({ dispatch, categories, subcategories }) => {
	const [expanded, expandedDispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const changed = Object.entries(expanded).filter(([key, exp]) => !categories.includes(key) && exp);
		if (changed.length === 0) {
			return;
		} else {
			expandedDispatch(changed[0][0]);
		}
	}, [categories]);

	return (
		<div>
			<h4>Subcategory Selection</h4>
			{categories.map((category, i) => (
				<div key={categoryTags[i]}>
					<h5>
						{category}{' '}
						{expanded[category] ? (
							<ChevronUp height="16" width="16" onClick={() => expandedDispatch(category)} />
						) : (
							<ChevronDown height="16" width="16" onClick={() => expandedDispatch(category)} />
						)}
					</h5>
					{expanded[category] && (
						<>
							{catToSubcat[category].map((subcategory: string, i: number) => (
								<div key={catToTags[category][i]}>
									<input
										onChange={() => dispatch(subcategory)}
										type="checkbox"
										id={catToTags[category][i]}
										value={subcategory}
										checked={subcategories.includes(subcategory)}
									/>
									<label htmlFor={catToTags[category][i]}>{subcategory}</label>
								</div>
							))}
						</>
					)}
				</div>
			))}
		</div>
	);
};

export default SubcategorySelection;
