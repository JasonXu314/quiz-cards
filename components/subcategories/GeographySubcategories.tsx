import { useState } from "react";
import { geographySubcats as subcats, geographyTags as tags } from '../../util/constants';
import ChevronDown from "../ChevronDown";
import ChevronUp from "../ChevronUp";

interface Props {
	dispatch: React.Dispatch<string>;
	subcategories: string[];
}


const GeographySubcategories: React.FC<Props> = ({ dispatch, subcategories }) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<div>
			<h5>Geography {expanded ? <ChevronUp height = "16" width = "16" onClick = {() => setExpanded(false)} /> :
				<ChevronDown height = "16" width = "16" onClick = {() => setExpanded(true)} />}</h5>
			{expanded && <>
					{subcats.map((subcategory, i) => <div key = {tags[i]}>
						<input onChange = {() => dispatch(subcategory)} type = "checkbox" id = {tags[i]} value = {subcategory}
							checked = {subcategories.includes(subcategory)} />
						<label htmlFor = {tags[i]}>{subcategory}</label>
					</div>)}
				</>}
			

			<style jsx>{`
				div div input {
					transform: translate(0, 12.5%);
				}

				div div label {
					user-select: none;
				}
				
				div div label, input {
					margin: 0.1em;
				}
			`}</style>
		</div>
	);
};

export default GeographySubcategories;