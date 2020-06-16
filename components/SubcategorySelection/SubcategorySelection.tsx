import ChevronDown from '$/ChevronDown/ChevronDown';
import ChevronUp from '$/ChevronUp/ChevronUp';
import { categories as cats, categoryTags, catToSubcat, catToTags } from '@/constants';
import { useEffect, useReducer } from 'react';

interface Props {
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	categories: string[];
	subcategories: string[];
}

const reducer: React.Reducer<{ [key: string]: boolean }, string> = (map, category) => {
	return {
		...map,
		[category]: !map[category]
	};
};

const SubcategorySelection: React.FC<Props> = ({ onChange, categories, subcategories }) => {
	const [expanded, expandedDispatch] = useReducer(reducer, Object.fromEntries(cats.map((category) => [category, false])));

	useEffect(() => {
		const changed = Object.entries(expanded).filter(([key, exp]) => !categories.includes(key) && exp);
		if (changed.length === 0) {
			return;
		} else {
			expandedDispatch(changed[0][0]);
		}
	}, [categories, expanded]);

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
										onChange={onChange}
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
