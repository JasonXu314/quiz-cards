import ChevronDown from '$/ChevronDown/ChevronDown';
import ChevronUp from '$/ChevronUp/ChevronUp';
import { categories as cats } from '@/constants';
import { useEffect, useReducer } from 'react';

interface Props {
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	categories: Category[];
	subcategories: string[];
}

type CategoryMap = { [key in keyof typeof cats]: boolean };

const reducer: React.Reducer<CategoryMap, Category> = (map, category) => {
	return {
		...map,
		[category]: !map[category]
	};
};

const SubcategorySelection: React.FC<Props> = ({ onChange, categories, subcategories }) => {
	const [expanded, expandedDispatch] = useReducer(reducer, Object.fromEntries(Object.keys(cats).map((category) => [category, false])) as CategoryMap);

	useEffect(() => {
		const changed = (Object.entries(expanded) as [Category, boolean][]).filter(([key, exp]) => !categories.includes(key) && exp);
		if (changed.length === 0) {
			return;
		} else {
			expandedDispatch(changed[0][0]);
		}
	}, [categories, expanded]);

	return (
		<div>
			<h4>Subcategory Selection</h4>
			{categories.map((category) => (
				<div key={cats[category].id}>
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
							{Object.entries(cats[category].subcategories).map(([subcategoryName, subcategory]) => (
								<div key={subcategory.id}>
									<input
										onChange={onChange}
										type="checkbox"
										id={subcategory.tag}
										value={subcategoryName}
										checked={subcategories.includes(subcategoryName)}
									/>
									<label htmlFor={subcategory.tag}>{subcategoryName}</label>
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
