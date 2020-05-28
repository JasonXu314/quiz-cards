import axios from 'axios';
import { NextPage } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../sass/Edit_id.module.scss';
import { categories, categoryTags, catToSubcat, catToTags } from '../../util/constants';

const Page: NextPage<{}> = () => {
	const [card, setCard] = useState<Card>(null);

	useEffect(() => {
		const { _id } = Router.query;
		document.title = `QuizCards - ${_id}`;
		axios(`/api/cards/${_id}`).then((res) => setCard(res.data));
	}, []);

	return (
		<div className={styles.main}>
			{card === null ? (
				<div>Loading...</div>
			) : (
				<div className={styles.card}>
					<div className={styles.id}>
						Editing: {card._id} by {card.author || 'N/A'}
					</div>
					<div className={styles.form}>
						<textarea cols={60} rows={5} value={card.hint} onChange={(evt) => setCard({ ...card, hint: evt.target.value })} />
					</div>
					<div className={styles.form}>
						<textarea cols={60} rows={5} value={card.answer} onChange={(evt) => setCard({ ...card, answer: evt.target.value })} />
					</div>
					<div className={styles.form}>
						<select
							onChange={(evt) => {
								setCard({ ...card, category: evt.target.value, subcategory: '' });
							}}
							value={card.category}>
							{categories.map((category, i) => (
								<option key={categoryTags[i]} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>
					<div className={styles.form}>
						<select onChange={(evt) => setCard({ ...card, subcategory: evt.target.value })} value={card.subcategory}>
							<option value=""></option>
							{catToSubcat[card.category].map((subcat: string, i: number) => (
								<option key={catToTags[card.category][i]} value={subcat}>
									{subcat}
								</option>
							))}
						</select>
					</div>
					<div className={styles.form}>
						<button
							onClick={() => {
								axios
									.put('/api/cards', {
										card
									})
									.then(() => {
										Router.push('/');
									});
							}}>
							Save
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Page;
