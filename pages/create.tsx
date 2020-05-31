import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import StyledInput from '../components/StyledInput/StyledInput';
import styles from '../sass/Create.module.scss';
import { categories, categoryTags, catToSubcat, catToTags } from '../util/constants';

const Create: NextPage<{}> = () => {
	const [category, setCategory] = useState<string>('Literature');
	const [subcategory, setSubcategory] = useState<string>('');
	const [hint, setHint] = useState<string>('');
	const [answer, setAnswer] = useState<string>('');
	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);
	const [author, setAuthor] = useState<string>('');

	return (
		<div className={styles.main}>
			<Head>
				<title>QuizCards - Create</title>
			</Head>
			<div className={styles.title}>QuizCards</div>
			<div className={styles.sidebar}>
				<h4>Category:</h4>
				<select
					onChange={(evt) => {
						setCategory(evt.target.value);
						setSubcategory('');
					}}
					value={category}>
					{categories.map((category, i) => (
						<option key={categoryTags[i]} value={category}>
							{category}
						</option>
					))}
				</select>
				{category !== '' && <h4>Subcategory:</h4>}
				<select onChange={(evt) => setSubcategory(evt.target.value)} value={subcategory}>
					<option value=""></option>
					{catToSubcat[category].map((subcat: string, i: number) => (
						<option key={catToTags[category][i]} value={subcat}>
							{subcat}
						</option>
					))}
				</select>
			</div>
			<form
				className={styles.card}
				onSubmit={(evt) => {
					evt.preventDefault();
					if (hint === '' && answer === '') {
						setError('Hint and Answer are required');
					} else if (hint === '') {
						setError('Hint is required');
					} else if (answer === '') {
						setError('Answer is required');
					} else {
						axios
							.post('/api/cards', {
								category,
								subcategory,
								hint,
								answer,
								author
							})
							.then((res) => setResponse(res.data))
							.catch((err) => setError(err.response?.data));
						setHint('');
						setAnswer('');
						setError(null);
					}
				}}>
				<h4>Hint:</h4>
				<textarea cols={60} rows={4} onChange={(evt) => setHint(evt.target.value)} value={hint} />
				<h4>Answer:</h4>
				<textarea className={styles.last} cols={60} rows={4} onChange={(evt) => setAnswer(evt.target.value)} value={answer} />
				<StyledInput onChange={(evt) => setAuthor(evt.target.value)} value={author} placeholder="Your Name (optional)" />
				<div>
					<button type="submit">Create!</button>
				</div>
				{response && <div>{response}</div>}
				{error && <div className={styles.error}>{error}</div>}
			</form>
		</div>
	);
};

export default Create;
