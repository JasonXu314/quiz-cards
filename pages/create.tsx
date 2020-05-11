import { NextPage } from "next";
import { useState } from "react";
import { categories, categoryTags, catToSubcat, catToTags } from '../util/constants';

const Create: NextPage<{}> = () => {
	const [category, setCategory] = useState<string>('Literature');
	const [subcategory, setSubcategory] = useState<string>('');
	
	return (
		<div id = "main">
			<div id = "title">
				QuizCards
			</div>
			<div id = "sidebar">
				<h4>Category:</h4>
				<select onChange = {(evt) => {
					setCategory(evt.target.value);
					setSubcategory('');
				}} value = {category}>
					{categories.map((category, i) => <option key = {categoryTags[i]} value = {category}>{category}</option>)}
				</select>
				{category !== '' && <h4>Subcategory:</h4>}
				<select onChange = {(evt) => setSubcategory(evt.target.value)} value = {subcategory}>
					<option value = ""></option>
					{catToSubcat[category].map((subcat: string, i: number) => <option key = {catToTags[category][i]} value = {subcat}>{subcat}</option>)}
				</select>
			</div>

			<style jsx>{`
				div#main {
					display: grid;
					grid-template: "title ." 1fr "card sidebar" auto / 12fr 2fr;
				}

				div#main div#title {
					grid-area: title;
				}

				div#main div#sidebar {
					grid-area: sidebar;
				}
			`}</style>
		</div>
	);
};

export default Create;