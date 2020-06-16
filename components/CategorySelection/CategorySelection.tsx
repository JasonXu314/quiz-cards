import ChevronDown from '$/ChevronDown/ChevronDown';
import ChevronUp from '$/ChevronUp/ChevronUp';
import { categories as cats, categoryTags as tags } from '@/constants';
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
					{cats.map((category, i) => (
						<div key={tags[i]}>
							<input onChange={onChange} type="checkbox" id={tags[i]} value={category} checked={categories.includes(category)} />
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
