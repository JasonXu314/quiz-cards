import StyledButton from '$/StyledButton/StyledButton';
import { categories, categoryTags, catToSubcat, catToTags } from '@/constants';
import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { ICard } from 'types';
import styles from '../../sass/Edit_id.module.scss';

const Page: NextPage = () => {
	const [card, setCard] = useState<ICard>(null);
	const [confirming, setConfirming] = useState<boolean>(false);

	useEffect(() => {
		const { _id } = Router.query;
		axios.get<ICard>(`/api/cards/${_id}`).then((res) => setCard(res.data));
	}, []);

	return (
		<div className={styles.main}>
			{card === null ? (
				<div>
					<Head>
						<title>QuizCards</title>
					</Head>
					Loading...
				</div>
			) : (
				<div className={styles.card}>
					<Head>
						<title>QuizCards - Editing {card._id}</title>
					</Head>
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
						<select onChange={(evt) => setCard({ ...card, subcategory: evt.target.value })} value={card.subcategory || ''}>
							<option value=""></option>
							{catToSubcat[card.category].map((subcat: string, i: number) => (
								<option key={catToTags[card.category][i]} value={subcat}>
									{subcat}
								</option>
							))}
						</select>
					</div>
					<div className={styles.form}>
						<StyledButton
							onClick={() => {
								axios
									.put('/api/cards', {
										card
									})
									.then(() => {
										Router.push('/');
									});
							}}
							type="primary"
							size="normal">
							Save
						</StyledButton>
					</div>
					<div className={styles.form}>
						<StyledButton
							onClick={() => {
								if (confirming) {
									axios
										.delete('/api/cards', {
											data: {
												_id: card._id
											}
										})
										.then(() => {
											Router.push('/');
										});
								} else {
									setConfirming(true);
								}
							}}
							type="action"
							size="normal">
							{confirming ? 'Confirm' : 'Delete'}
						</StyledButton>
					</div>
				</div>
			)}
		</div>
	);
};

export default Page;
