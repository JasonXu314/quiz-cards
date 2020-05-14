import axios from 'axios';
import { GetServerSideProps, NextPage } from "next";
import Link from 'next/link';
import { useReducer, useState } from "react";
import ImportCard from '../components/ImportCard';
import styles from '../sass/Import.module.scss';
import { categories, categoryTags, catToSubcat, catToTags } from '../util/constants';
import { processCards } from "../util/util";

const reducer: React.Reducer<ProtoCard[], ImportCardReducerAction> = (cards, action) => {
	const newCards = [...cards];

	switch (action.type) {
		case ('SET'):
			return action.cards;
		case ('CATEGORY'):
			newCards[action.i].category = action.category;
			return newCards;
		case('SUBCATEGORY'):
			newCards[action.i].subcategory = action.subcategory;
			return newCards;
	}
};

const Import: NextPage<{ url: string }> = ({ url }) => {
	const [cards, dispatch] = useReducer(reducer, []);
	const [category, setCategory] = useState<string>('Literature');
	const [subcategory, setSubcategory] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState(null);
	
	return (
		<div className = {styles.main}>
			<div className = {styles.title}>QuizCards</div>

			<div className = {styles.sidebar}>
				{cards.length === 0 ? <>
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
				</> : <button onClick = {() => {
					axios.post('/api/cards/import', { cards }).catch((err) => {
						console.log(err.response);
							setError(err.response);
					});
				}}>Import!</button>}
				<div>
					<h3>Instructions:</h3>
					<p>In Anki, navigate to the overview screen containing all your decks</p>
					<p>Click the gear next to the desired deck and hit export</p>
					<p>Set the Export Format to "Cards in Plain Text (*.txt)</p>
				</div>
				<div>
					<Link href = "/"><a>Home</a></Link>
				</div>
				<div>
					<Link href = "/create"><a>Create new cards</a></Link>
				</div>
				{error && <div className = {styles.error}>{error}</div>}
			</div>
			
			<div className = {styles.cards}>
				{cards.length === 0 && !loading && <input type = "file" onChange = {(evt) => {
						setLoading(true);
						Array.from(evt.target.files).forEach((file) => {
							file.text().then((text) => processCards(text, category, subcategory))
								.then((cards) => {
									dispatch({ 
										type: 'SET',
										cards
									});
									setLoading(false);
								});
						});
					}} />}
				{cards.map((card, i) => <ImportCard key = {i} card = {card} dispatch = {dispatch} index = {i} />)}
			</div>
			<div className = {styles.loading}>
				<div><img className = {styles.spinner} src = {url} alt = "Loading..." hidden = {!loading} /></div>
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
}

export default Import;