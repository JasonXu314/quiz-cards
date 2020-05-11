import axios from 'axios';
import { NextPage } from "next";
import { useState } from "react";
import styles from '../sass/Create.module.scss';
import { categories, categoryTags, catToSubcat, catToTags } from '../util/constants';

const Create: NextPage<{}> = () => {
	const [category, setCategory] = useState<string>('Literature');
	const [subcategory, setSubcategory] = useState<string>('');
	const [hint, setHint] = useState<string>('');
	const [answer, setAnswer] = useState<string>('');
	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);
	
	return (
		<div className = {styles.main}>
			<div className = {styles.title}>
				QuizCards
			</div>
			<div className = {styles.sidebar}>
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
			<form className = {styles.card} onSubmit = {(evt) => {
				evt.preventDefault();
				if (hint === '' && answer === '') {
					setError('Hint and Answer are required');
				}
				else if (hint === '') {
					setError('Hint is required');
				}
				else if (answer === '') {
					setError('Answer is required');
				}
				else {
					axios.post('/api/cards', {
						category,
						subcategory,
						hint,
						answer
					}).then((res) => setResponse(res.data)).catch((err) => setError(err.response?.data));
					setCategory('Literature');
					setSubcategory('');
					setHint('');
					setAnswer('');
					setError(null);
				}
			}}>
				<h4>Hint:</h4>
				<input onChange = {(evt) => setHint(evt.target.value)} value = {hint} />
				<h4>Answer:</h4>
				<input onChange = {(evt) => setAnswer(evt.target.value)} value = {answer} />
				<div>
					<button type = "submit">Create!</button>
				</div>
				{response && <div>{response}</div>}
				{error && <div className = {styles.error}>{error}</div>}
			</form>
		</div>
	);
};

export default Create;