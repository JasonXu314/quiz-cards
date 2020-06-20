import ImportCard from '$/ImportCard/ImportCard';
import StyledInput from '$/StyledInput/StyledInput';
import { categories } from '@/constants';
import { processCards } from '@/util';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useReducer, useState } from 'react';
import { Category, ImportCardReducerAction, IProtoCard, Subcategory } from 'types';
import styles from '../sass/Import.module.scss';

const reducer: React.Reducer<IProtoCard[], ImportCardReducerAction> = (cards, action) => {
	const newCards = [...cards];

	switch (action.type) {
		case 'SET':
			return action.cards;
		case 'CATEGORY':
			newCards[action.i].category = action.category;
			return newCards;
		case 'SUBCATEGORY':
			newCards[action.i].subcategory = action.subcategory;
			return newCards;
	}
};

const Import: NextPage<{ url: string }> = ({ url }) => {
	const [cards, dispatch] = useReducer(reducer, []);
	const [category, setCategory] = useState<Category>('Literature');
	const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState<number>(0);
	const [msg, setMsg] = useState<string>('');
	const [author, setAuthor] = useState<string>('');
	const [dragging, setDragging] = useState<boolean>(false);

	return (
		<div className={styles.main}>
			<Head>
				<title>QuizCards - Import</title>
			</Head>
			<div className={styles.title}>QuizCards</div>
			<div className={styles.sidebar}>
				{cards.length === 0 ? (
					<>
						<h4>Category:</h4>
						<select
							onChange={(evt) => {
								setCategory(evt.target.value as Category);
								setSubcategory(null);
							}}
							value={category}>
							{Object.entries(categories).map(([categoryName, thisCategory]) => (
								<option key={thisCategory.id} value={categoryName}>
									{categoryName}
								</option>
							))}
						</select>
						<h4>Subcategory:</h4>
						<select onChange={(evt) => setSubcategory(evt.target.value === '' ? null : (evt.target.value as Subcategory))} value={subcategory || ''}>
							<option value=""></option>
							{Object.entries(categories[category].subcategories).map(([subcategoryName, thisSubcategory]) => (
								<option key={thisSubcategory.id} value={subcategoryName}>
									{subcategoryName}
								</option>
							))}
						</select>
						<div className={styles.spacer} />
						<StyledInput onChange={(evt) => setAuthor(evt.target.value)} value={author} placeholder="Your Name (optional)" />
					</>
				) : (
					<button
						onClick={() => {
							axios
								.post('/api/cards/import', { cards })
								.then((res) => {
									setMsg(res.data);
									dispatch({ type: 'SET', cards: [] });
								})
								.catch((err) => {
									console.log(err.response);
									setError(err.response);
								});
						}}
						className={styles.import}>
						Import!
					</button>
				)}
				<hr />
				<div>
					<h3>Instructions:</h3>
					<p>In Anki, navigate to the overview screen containing all your decks</p>
					<p>Click the gear next to the desired deck and hit export</p>
					<p>Set the Export Format to &quot;Cards in Plain Text (*.txt)&quot;</p>
				</div>
				<hr />
				<div>
					<Link href="/">
						<a>Home</a>
					</Link>
				</div>
				<div>
					<Link href="/create">
						<a>Create new cards</a>
					</Link>
				</div>
				{error && <div className={styles.error}>{error}</div>}
			</div>

			<div className={styles.cards}>
				{cards.length === 0 && !loading ? (
					<>
						<input
							type="file"
							onChange={(evt) => {
								setLoading(true);
								Array.from(evt.target.files!).forEach((file) => {
									file.text()
										.then((text) => processCards(text, category, subcategory, author))
										.then((cards) => {
											dispatch({
												type: 'SET',
												cards
											});
											setLoading(false);
										});
								});
							}}
							id="file-input"
							className={styles.hide}
						/>
						<label
							htmlFor="file-input"
							className={styles.button + (dragging ? ' ' + styles.dragging : '')}
							onDragEnter={() => setDragging(true)}
							onDragLeave={() => setDragging(false)}
							onDrop={(evt) => {
								evt.preventDefault();
								setDragging(false);
								setLoading(true);
								Array.from(evt.dataTransfer.files).forEach((file) => {
									file.text()
										.then((text) => processCards(text, category, subcategory, author))
										.then((cards) => {
											dispatch({
												type: 'SET',
												cards
											});
											setLoading(false);
										});
								});
							}}
							onDragOver={(evt) => evt.preventDefault()}>
							Select File
						</label>
					</>
				) : (
					<>
						<div className={styles.buttons}>
							<button className={styles.button} onClick={() => setPage(page - 1)} disabled={page === 0}>
								&lt; Back
							</button>
							<div>Page {page + 1}</div>
							<button className={styles.button} onClick={() => setPage(page + 1)} disabled={page === Math.floor(cards.length / 100)}>
								Next &gt;
							</button>
						</div>
						{cards.slice(page * 100, (page + 1) * 100).map((card, i) => (
							<ImportCard key={i} card={card} dispatch={dispatch} index={i} />
						))}
						<div className={styles.buttons}>
							<button className={styles.button} onClick={() => setPage(page - 1)} disabled={page === 0}>
								&lt; Back
							</button>
							<div>Page {page + 1}</div>
							<button className={styles.button} onClick={() => setPage(page + 1)} disabled={page === Math.floor(cards.length / 100)}>
								Next &gt;
							</button>
						</div>
					</>
				)}
				{msg !== '' && <h3>{msg}</h3>}
			</div>
			<div className={styles.loading}>
				<div>
					<img className={styles.spinner} src={url} alt="Loading..." hidden={!loading} />
				</div>
				<div>{loading && 'Loading, Plz wait...'}</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	const imgUrls = ['Manar1.png', 'Slois1.jpg', 'Slois2.png', 'Slois3.png', 'Slois4.png'];

	return {
		props: {
			url: imgUrls[Math.floor(Math.random() * 4)]
		}
	};
};

export default Import;
