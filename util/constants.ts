export const categories = [
		'Literature',
		'Science',
		'History',
		'Fine Arts',
		'Mythology',
		'Religion',
		'Geography',
		'Philosophy',
		'Current Events',
		'Social Science',
		'Trash'
	] as const,
	categoryTags = ['lit', 'sci', 'his', 'fas', 'myt', 'rel', 'geo', 'phi', 'cre', 'ssc', 'tra'] as const;

export const literatureSubcats = [
		'Literature American',
		'Literature British',
		'Literature Classical',
		'Literature European',
		'Literature Other',
		'Literature World'
	] as const,
	literatureTags = ['lit-am', 'lit-br', 'lit-cl', 'lit-eu', 'lit-ot', 'lit-wo'] as const;

export const scienceSubcats = [
		'Science American',
		'Science Biology',
		'Science Chemistry',
		'Science Computer Science',
		'Science Math',
		'Science Other',
		'Science Physics',
		'Science World'
	] as const,
	scienceTags = ['sci-am', 'sci-bi', 'sci-ch', 'sci-cs', 'sci-ma', 'sci-ot', 'sci-ph', 'sci-wo'] as const;

export const historySubcats = ['History American', 'History British', 'History Classical', 'History European', 'History Other', 'History World'] as const,
	historyTags = ['his-am', 'his-br', 'his-cl', 'his-eu', 'his-ot', 'his-wo'] as const;

export const fineArtsSubcats = [
		'Fine Arts American',
		'Fine Arts Audiovisual',
		'Fine Arts Auditory',
		'Fine Arts British',
		'Fine Arts European',
		'Fine Arts Opera',
		'Fine Arts Other',
		'Fine Arts Visual',
		'Fine Arts World'
	] as const,
	fineArtsTags = ['fas-am', 'fas-av', 'fas-au', 'fas-br', 'fas-eu', 'fas-op', 'fas-ot', 'fas-vs', 'fas-wo'] as const;

export const mythologySubcats = [
		'Mythology American',
		'Mythology Chinese',
		'Mythology Egyptian',
		'Mythology Greco-Roman',
		'Mythology Indian',
		'Mythology Japanese',
		'Mythology Norse',
		'Mythology Other',
		'Mythology Other East Asian'
	] as const,
	mythologyTags = ['myt-am', 'myt-ch', 'myt-eg', 'myt-gr', 'myt-in', 'myt-ja', 'myt-no', 'myt-ot', 'myt-ea'] as const;

export const religionSubcats = [
		'Religion American',
		'Religion Christianity',
		'Religion East Asian',
		'Religion Islam',
		'Religion Judaism',
		'Religion Other'
	] as const,
	religionTags = ['rel-am', 'rel-ch', 'rel-ea', 'rel-is', 'rel-jd', 'rel-ot'] as const;

export const geographySubcats = ['Geography American', 'Geography World'] as const,
	geographyTags = ['geo-am', 'geo-wo'] as const;

export const philosophySubcats = ['Philosophy American', 'Philosophy Classical', 'Philosophy East Asian', 'Philosophy European', 'Philosophy Other'] as const,
	philosophyTags = ['phi-am', 'phi-cl', 'phi-ea', 'phi-eu', 'phi-ot'] as const;

export const currentEventsSubcats = ['Current Events American', 'Current Events Other'] as const,
	currentEventsTags = ['cre-am', 'cre-ot'] as const;

export const socialScienceSubcats = [
		'Social Science American',
		'Social Science Anthropology',
		'Social Science Economics',
		'Social Science Linguistics',
		'Social Science Other',
		'Social Science Political Science',
		'Social Science Psychology',
		'Social Science Sociology'
	] as const,
	socialScienceTags = ['ssc-am', 'ssc-an', 'ssc-ec', 'ssc-li', 'ssc-ot', 'ssc-ps', 'ssc-py', 'ssc-so'] as const;

export const trashSubcats = ['Trash American', 'Trash Movies', 'Trash Music', 'Trash Other', 'Trash Sports', 'Trash Television', 'Trash Video Games'] as const,
	trashTags = ['tra-am', 'tra-mo', 'tra-mu', 'tra-ot', 'tra-sp', 'tra-tv', 'tra-vg'] as const;

export const catToSubcat = {
		Literature: literatureSubcats,
		Science: scienceSubcats,
		History: historySubcats,
		'Fine Arts': fineArtsSubcats,
		Mythology: mythologySubcats,
		Religion: religionSubcats,
		Geography: geographySubcats,
		Philosophy: philosophySubcats,
		'Current Events': currentEventsSubcats,
		'Social Science': socialScienceSubcats,
		Trash: trashSubcats
	},
	catToTags = {
		Literature: literatureTags,
		Science: scienceTags,
		History: historyTags,
		'Fine Arts': fineArtsTags,
		Mythology: mythologyTags,
		Religion: religionTags,
		Geography: geographyTags,
		Philosophy: philosophyTags,
		'Current Events': currentEventsTags,
		'Social Science': socialScienceTags,
		Trash: trashTags
	};
