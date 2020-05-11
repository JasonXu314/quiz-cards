import CurrentEventsSubcategories from "./subcategories/CurrentEventsSubcategories";
import FineArtsSubcategories from "./subcategories/FineArtsSubcategories";
import GeographySubcategories from "./subcategories/GeographySubcategories";
import HistorySubcategories from "./subcategories/HistorySubcategories";
import LiteratureSubcategories from "./subcategories/LiteratureSubcategories";
import MythologySubcategories from "./subcategories/MythologySubcategories";
import PhilosophySubcategories from "./subcategories/PhilosophySubcategories";
import ReligionSubcategories from "./subcategories/ReligionSubcategories";
import ScienceSubcategories from "./subcategories/ScienceSubcategories";
import SocialScienceSubcategories from "./subcategories/SocialScienceSubcategories.";
import TrashSubcategories from "./subcategories/TrashSubcategories";

interface Props {
	dispatch: React.Dispatch<string>;
	categories: string[];
	subcategories: string[]
}

const SubcategorySelection: React.FC<Props> = ({ dispatch, categories, subcategories }) => {
	return (
		<div>
			<h4>Subcategory Selection</h4>
			{categories.includes('Literature') && <LiteratureSubcategories dispatch = {dispatch} subcategories = {subcategories} />}
			{categories.includes('Science') && <ScienceSubcategories dispatch = {dispatch} subcategories = {subcategories} />}
			{categories.includes('History') && <HistorySubcategories dispatch = {dispatch} subcategories = {subcategories} />}
			{categories.includes('Fine Arts') && <FineArtsSubcategories dispatch = {dispatch} subcategories = {subcategories} />}
			{categories.includes('Mythology') && <MythologySubcategories dispatch = {dispatch} subcategories = {subcategories} />}
			{categories.includes('Religion') && <ReligionSubcategories dispatch = {dispatch} subcategories = {subcategories} />}
			{categories.includes('Geography') && <GeographySubcategories dispatch = {dispatch} subcategories = {subcategories} />}
			{categories.includes('Philosophy') && <PhilosophySubcategories dispatch = {dispatch} subcategories = {subcategories} />}
			{categories.includes('Current Events') && <CurrentEventsSubcategories dispatch = {dispatch} subcategories = {subcategories} />}
			{categories.includes('Social Science') && <SocialScienceSubcategories dispatch = {dispatch} subcategories = {subcategories} />}
			{categories.includes('Trash') && <TrashSubcategories dispatch = {dispatch} subcategories = {subcategories} />}
		</div>
	);
};

export default SubcategorySelection;