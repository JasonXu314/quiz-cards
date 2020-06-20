import ChevronDown from '$/ChevronDown/ChevronDown';
import ChevronUp from '$/ChevronUp/ChevronUp';
import { categories as cats } from '@/constants';
import { useState } from 'react';
import styles from './CategorySelection.module.scss';

interface Props {
	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	categories: string[];
}

const CategorySelection: React.FC<Props> = ({ onChange, categories }) => {
	const [expanded, setExpanded] = useState<boolean>(true);

	return (
		<div className={styles.main}>
			<h4>Categories {expanded ? <ChevronUp onClick={() => setExpanded(false)} /> : <ChevronDown onClick={() => setExpanded(true)} />}</h4>
			{expanded && (
				<>
					{Object.entries(cats).map(([category, { id }]) => (
						<div key={id} className={styles.category}>
							<input onChange={onChange} type="checkbox" id={'category' + id} value={category} checked={categories.includes(category)} />
							<label htmlFor={'category' + id}>{category}</label>
						</div>
					))}
				</>
			)}
		</div>
	);
};

export default CategorySelection;
