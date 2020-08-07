import { categories } from '@/constants';
import { compileCardRequest } from '@/util';
import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../../sass/EditIndex.module.scss';

const Index: NextPage = () => {
	const [category, setCategory] = useState<Category | ''>('');
	const [subcategory, setSubcategory] = useState<Subcategory | ''>('');
	const [page, setPage] = useState<number>(0);
	const [cards, setCards] = useState<ICard[]>([]);

	return (
		<div className={styles.main}>
			<Head>QuizCards - Edit</Head>
			<div className={styles.title}>QuizCards</div>

			<div className={styles.sidebar}>
				<h4>Category:</h4>
				<select
					onChange={(evt) => {
						setCategory(evt.target.value as Category);
						setSubcategory('');
					}}
					value={category}>
					<option value=""></option>
					{categories.entries.map(([categoryName, category]) => (
						<option key={category.id} value={categoryName}>
							{categoryName}
						</option>
					))}
				</select>
				{category !== '' && (
					<>
						<h4>Subcategory:</h4>
						<select onChange={(evt) => setSubcategory(evt.target.value as Subcategory)} value={subcategory}>
							<option value=""></option>
							{Object.entries(categories[category].subcategories).map(([subcategoryName, subcategory]) => (
								<option key={subcategory.id} value={subcategoryName}>
									{subcategoryName}
								</option>
							))}
						</select>
					</>
				)}
				<br />
				{category != '' && (
					<button
						onClick={() => {
							axios
								.get<ICardIndexResponse>(
									compileCardRequest('/api/cards', {
										categories: [category],
										subcategories: [subcategory]
									})
								)
								.then((res) => {
									setCards(res.data.cards);
								});
						}}>
						Search Cards
					</button>
				)}
				{cards.length !== 0 && <div>Click on a card to edit</div>}
			</div>

			<div className={styles.content}>
				<div className={styles.buttons}>
					<button onClick={() => setPage(page - 1)} disabled={page === 0} className={styles.button}>
						&lt; Back
					</button>
					<div>Page {page + 1}</div>
					<button onClick={() => setPage(page + 1)} disabled={page === Math.floor(cards.length / 50)} className={styles.button}>
						Next &gt;
					</button>
				</div>
				{cards.slice(page * 50, (page + 1) * 50).map((card) => (
					<Link href="/edit/[_id]" as={`/edit/${card.id}`} key={card.id}>
						<a>
							<div className={styles.card}>
								<h3 className={styles.hint}>{card.hint}</h3>
								<p className={styles.answer}>{card.answer}</p>
								<h4 className={styles.category}>
									{card.category}, {card.subcategory}
								</h4>
								<p className={styles.author}>Author: {card.author || 'N/A'}</p>
							</div>
						</a>
					</Link>
				))}
				<div className={styles.buttons}>
					<button onClick={() => setPage(page - 1)} disabled={page === 0} className={styles.button}>
						&lt; Back
					</button>
					<div>Page {page + 1}</div>
					<button onClick={() => setPage(page + 1)} disabled={page === Math.floor(cards.length / 50)} className={styles.button}>
						Next &gt;
					</button>
				</div>
			</div>
		</div>
	);
};

export default Index;
