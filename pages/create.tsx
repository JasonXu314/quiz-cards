import StyledInput from '$/StyledInput/StyledInput';
import { categories } from '@/constants';
import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Category, Subcategory } from 'types';
import styles from '../sass/Create.module.scss';

const Create: NextPage = () => {
	const [category, setCategory] = useState<Category>('Literature');
	const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
	const [hint, setHint] = useState<string>('');
	const [answer, setAnswer] = useState<string>('');
	const [response, setResponse] = useState(null);
	const [error, setError] = useState<string | null>(null);
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
						setCategory(evt.target.value as Category);
						setSubcategory(null);
					}}
					value={category}>
					{Object.entries(categories).map(([categoryName, category]) => (
						<option key={category.id} value={categoryName}>
							{categoryName}
						</option>
					))}
				</select>
				<h4>Subcategory:</h4>
				<select onChange={(evt) => setSubcategory(evt.target.value === '' ? null : (evt.target.value as Subcategory))} value={subcategory || ''}>
					<option value=""></option>
					{Object.entries(categories[category].subcategories).map(([subcategoryName, subcategory]) => (
						<option key={subcategory.id} value={subcategoryName}>
							{subcategoryName}
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
