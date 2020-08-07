export const difNumToString = {
		1: '1 (Middle School)',
		2: '2 (Easy High School)',
		3: '3 (Regular High School)',
		4: '4 (Hard High School)',
		5: '5 (Nationals High School)',
		6: '6 (Easy College)',
		7: '7 (Regular College)',
		8: '8 (Hard College)',
		9: '9 (Open)'
	},
	difNumToTags = {
		1: 'ms-r',
		2: 'hs-e',
		3: 'hs-r',
		4: 'hs-h',
		5: 'hs-n',
		6: 'co-e',
		7: 'co-r',
		8: 'co-h',
		9: 'op'
	};

export const categories = {
	Literature: {
		tag: 'lit',
		id: 15,
		subcategories: {
			'Literature American': {
				tag: 'lit-am',
				id: 4
			},
			'Literature British': {
				tag: 'lit-br',
				id: 22
			},
			'Literature Classical': {
				tag: 'lit-cl',
				id: 30
			},
			'Literature European': {
				tag: 'lit-eu',
				id: 1
			},
			'Literature Other': {
				tag: 'lit-ot',
				id: 29
			},
			'Literature World': {
				tag: 'lit-wo',
				id: 12
			}
		}
	},
	Science: {
		tag: 'sci',
		id: 17,
		subcategories: {
			'Science American': {
				tag: 'sci-am',
				id: 36
			},
			'Science Biology': {
				tag: 'sci-bi',
				id: 14
			},
			'Science Chemistry': {
				tag: 'sci-ch',
				id: 5
			},
			'Science Computer Science': {
				tag: 'sci-cs',
				id: 23
			},
			'Science Math': {
				tag: 'sci-ma',
				id: 26
			},
			'Science Other': {
				tag: 'sci-ot',
				id: 10
			},
			'Science Physics': {
				tag: 'sci-ph',
				id: 18
			},
			'Science World': {
				tag: 'sci-wo',
				id: 37
			}
		}
	},
	History: {
		tag: 'his',
		id: 18,
		subcategories: {
			'History American': {
				tag: 'his-am',
				id: 13
			},
			'History British': {
				tag: 'his-br',
				id: 6
			},
			'History Classical': {
				tag: 'his-cl',
				id: 16
			},
			'History European': {
				tag: 'his-eu',
				id: 24
			},
			'History Other': {
				tag: 'his-ot',
				id: 28
			},
			'History World': {
				tag: 'his-wo',
				id: 20
			}
		}
	},
	'Fine Arts': {
		tag: 'fas',
		id: 21,
		subcategories: {
			'Fine Arts American': {
				tag: 'fas-am',
				id: 35
			},
			'Fine Arts Audiovisual': {
				tag: 'fas-av',
				id: 27
			},
			'Fine Arts Auditory': {
				tag: 'fas-au',
				id: 8
			},
			'Fine Arts British': {
				tag: 'fas-br',
				id: 45
			},
			'Fine Arts European': {
				tag: 'fas-eu',
				id: 50
			},
			'Fine Arts Opera': {
				tag: 'fas-op',
				id: 77
			},
			'Fine Arts Other': {
				tag: 'fas-ot',
				id: 25
			},
			'Fine Arts Visual': {
				tag: 'fas-vs',
				id: 2
			},
			'Fine Arts World': {
				tag: 'fas-wo',
				id: 43
			}
		}
	},
	Mythology: {
		tag: 'myt',
		id: 14,
		subcategories: {
			'Mythology American': {
				tag: 'myt-am',
				id: 33
			},
			'Mythology Chinese': {
				tag: 'myt-ch',
				id: 47
			},
			'Mythology Egyptian': {
				tag: 'myt-eg',
				id: 65
			},
			'Mythology Greco-Roman': {
				tag: 'myt-gr',
				id: 58
			},
			'Mythology Indian': {
				tag: 'myt-in',
				id: 46
			},
			'Mythology Japanese': {
				tag: 'myt-ja',
				id: 48
			},
			'Mythology Norse': {
				tag: 'myt-no',
				id: 63
			},
			'Mythology Other': {
				tag: 'myt-ot',
				id: 54
			},
			'Mythology Other East Asian': {
				tag: 'myt-ea',
				id: 49
			}
		}
	},
	Religion: {
		tag: 'rel',
		id: 19,
		subcategories: {
			'Religion American': {
				tag: 'rel-am',
				id: 31
			},
			'Religion Christianity': {
				tag: 'rel-ch',
				id: 57
			},
			'Religion East Asian': {
				tag: 'rel-ea',
				id: 51
			},
			'Religion Islam': {
				tag: 'rel-is',
				id: 68
			},
			'Religion Judaism': {
				tag: 'rel-jd',
				id: 69
			},
			'Religion Other': {
				tag: 'rel-ot',
				id: 62
			}
		}
	},
	Geography: {
		tag: 'geo',
		id: 20,
		subcategories: {
			'Geography American': {
				tag: 'geo-am',
				id: 38
			},
			'Geography World': {
				tag: 'geo-wo',
				id: 44
			}
		}
	},
	Philosophy: {
		tag: 'phi',
		id: 25,
		subcategories: {
			'Philosophy American': {
				tag: 'phi-am',
				id: 39
			},
			'Philosophy Classical': {
				tag: 'phi-cl',
				id: 61
			},
			'Philosophy East Asian': {
				tag: 'phi-ea',
				id: 52
			},
			'Philosophy European': {
				tag: 'phi-eu',
				id: 66
			},
			'Philosophy Other': {
				tag: 'phi-ot',
				id: 74
			}
		}
	},
	'Current Events': {
		tag: 'cre',
		id: 26,
		subcategories: {
			'Current Events American': {
				tag: 'cre-am',
				id: 40
			},
			'Current Events Other': {
				tag: 'cre-ot',
				id: 42
			}
		}
	},
	'Social Science': {
		tag: 'ssc',
		id: 22,
		subcategories: {
			'Social Science American': {
				tag: 'ssc-am',
				id: 34
			},
			'Social Science Anthropology': {
				tag: 'ssc-an',
				id: 76
			},
			'Social Science Economics': {
				tag: 'ssc-ec',
				id: 56
			},
			'Social Science Linguistics': {
				tag: 'ssc-li',
				id: 75
			},
			'Social Science Other': {
				tag: 'ssc-ot',
				id: 60
			},
			'Social Science Political Science': {
				tag: 'ssc-ps',
				id: 71
			},
			'Social Science Psychology': {
				tag: 'ssc-py',
				id: 73
			},
			'Social Science Sociology': {
				tag: 'ssc-so',
				id: 0
			}
		}
	},
	Trash: {
		tag: 'tra',
		id: 16,
		subcategories: {
			'Trash American': {
				tag: 'tra-am',
				id: 32
			},
			'Trash Movies': {
				tag: 'tra-mo',
				id: 72
			},
			'Trash Music': {
				tag: 'tra-mu',
				id: 67
			},
			'Trash Other': {
				tag: 'tra-ot',
				id: 59
			},
			'Trash Sports': {
				tag: 'tra-sp',
				id: 55
			},
			'Trash Television': {
				tag: 'tra-tv',
				id: 70
			},
			'Trash Video Games': {
				tag: 'tra-vg',
				id: 53
			}
		}
	},
	get entries(): [Category, ICategory][] {
		const entries: [Category, ICategory][] = [];

		for (const key in this) {
			if (key === 'entries') {
				continue;
			} else {
				const k = key as Category;
				entries.push([k, this[k]]);
			}
		}

		return entries;
	}
} as Record<Category, ICategory> & { entries: [Category, ICategory][] };

export const subcategories = {
	'Literature American': {
		tag: 'lit-am',
		id: 4,
		categoryName: 'Literature'
	},
	'Literature British': {
		tag: 'lit-br',
		id: 22,
		categoryName: 'Literature'
	},
	'Literature Classical': {
		tag: 'lit-cl',
		id: 30,
		categoryName: 'Literature'
	},
	'Literature European': {
		tag: 'lit-eu',
		id: 1,
		categoryName: 'Literature'
	},
	'Literature Other': {
		tag: 'lit-ot',
		id: 29,
		categoryName: 'Literature'
	},
	'Literature World': {
		tag: 'lit-wo',
		id: 12,
		categoryName: 'Literature'
	},
	'Science American': {
		tag: 'sci-am',
		id: 36,
		categoryName: 'Science'
	},
	'Science Biology': {
		tag: 'sci-bi',
		id: 14,
		categoryName: 'Science'
	},
	'Science Chemistry': {
		tag: 'sci-ch',
		id: 5,
		categoryName: 'Science'
	},
	'Science Computer Science': {
		tag: 'sci-cs',
		id: 23,
		categoryName: 'Science'
	},
	'Science Math': {
		tag: 'sci-ma',
		id: 26,
		categoryName: 'Science'
	},
	'Science Other': {
		tag: 'sci-ot',
		id: 10,
		categoryName: 'Science'
	},
	'Science Physics': {
		tag: 'sci-ph',
		id: 18,
		categoryName: 'Science'
	},
	'Science World': {
		tag: 'sci-wo',
		id: 37,
		categoryName: 'Science'
	},
	'History American': {
		tag: 'his-am',
		id: 13,
		categoryName: 'History'
	},
	'History British': {
		tag: 'his-br',
		id: 6,
		categoryName: 'History'
	},
	'History Classical': {
		tag: 'his-cl',
		id: 16,
		categoryName: 'History'
	},
	'History European': {
		tag: 'his-eu',
		id: 24,
		categoryName: 'History'
	},
	'History Other': {
		tag: 'his-ot',
		id: 28,
		categoryName: 'History'
	},
	'History World': {
		tag: 'his-wo',
		id: 20,
		categoryName: 'History'
	},
	'Fine Arts American': {
		tag: 'fas-am',
		id: 35,
		categoryName: 'Fine Arts'
	},
	'Fine Arts Audiovisual': {
		tag: 'fas-av',
		id: 27,
		categoryName: 'Fine Arts'
	},
	'Fine Arts Auditory': {
		tag: 'fas-au',
		id: 8,
		categoryName: 'Fine Arts'
	},
	'Fine Arts British': {
		tag: 'fas-br',
		id: 45,
		categoryName: 'Fine Arts'
	},
	'Fine Arts European': {
		tag: 'fas-eu',
		id: 50,
		categoryName: 'Fine Arts'
	},
	'Fine Arts Opera': {
		tag: 'fas-op',
		id: 77,
		categoryName: 'Fine Arts'
	},
	'Fine Arts Other': {
		tag: 'fas-ot',
		id: 25,
		categoryName: 'Fine Arts'
	},
	'Fine Arts Visual': {
		tag: 'fas-vs',
		id: 2,
		categoryName: 'Fine Arts'
	},
	'Fine Arts World': {
		tag: 'fas-wo',
		id: 43,
		categoryName: 'Fine Arts'
	},
	'Mythology American': {
		tag: 'myt-am',
		id: 33,
		categoryName: 'Mythology'
	},
	'Mythology Chinese': {
		tag: 'myt-ch',
		id: 47,
		categoryName: 'Mythology'
	},
	'Mythology Egyptian': {
		tag: 'myt-eg',
		id: 65,
		categoryName: 'Mythology'
	},
	'Mythology Greco-Roman': {
		tag: 'myt-gr',
		id: 58,
		categoryName: 'Mythology'
	},
	'Mythology Indian': {
		tag: 'myt-in',
		id: 46,
		categoryName: 'Mythology'
	},
	'Mythology Japanese': {
		tag: 'myt-ja',
		id: 48,
		categoryName: 'Mythology'
	},
	'Mythology Norse': {
		tag: 'myt-no',
		id: 63,
		categoryName: 'Mythology'
	},
	'Mythology Other': {
		tag: 'myt-ot',
		id: 54,
		categoryName: 'Mythology'
	},
	'Mythology Other East Asian': {
		tag: 'myt-ea',
		id: 49,
		categoryName: 'Mythology'
	},
	'Religion American': {
		tag: 'rel-am',
		id: 31,
		categoryName: 'Religion'
	},
	'Religion Christianity': {
		tag: 'rel-ch',
		id: 57,
		categoryName: 'Religion'
	},
	'Religion East Asian': {
		tag: 'rel-ea',
		id: 51,
		categoryName: 'Religion'
	},
	'Religion Islam': {
		tag: 'rel-is',
		id: 68,
		categoryName: 'Religion'
	},
	'Religion Judaism': {
		tag: 'rel-jd',
		id: 69,
		categoryName: 'Religion'
	},
	'Religion Other': {
		tag: 'rel-ot',
		id: 62,
		categoryName: 'Religion'
	},
	'Geography American': {
		tag: 'geo-am',
		id: 38,
		categoryName: 'Geography'
	},
	'Geography World': {
		tag: 'geo-wo',
		id: 44,
		categoryName: 'Geography'
	},
	'Philosophy American': {
		tag: 'phi-am',
		id: 39,
		categoryName: 'Philosophy'
	},
	'Philosophy Classical': {
		tag: 'phi-cl',
		id: 61,
		categoryName: 'Philosophy'
	},
	'Philosophy East Asian': {
		tag: 'phi-ea',
		id: 52,
		categoryName: 'Philosophy'
	},
	'Philosophy European': {
		tag: 'phi-eu',
		id: 66,
		categoryName: 'Philosophy'
	},
	'Philosophy Other': {
		tag: 'phi-ot',
		id: 74,
		categoryName: 'Philosophy'
	},
	'Current Events American': {
		tag: 'cre-am',
		id: 40,
		categoryName: 'Current Events'
	},
	'Current Events Other': {
		tag: 'cre-ot',
		id: 42,
		categoryName: 'Current Events'
	},
	'Social Science American': {
		tag: 'ssc-am',
		id: 34,
		categoryName: 'Social Science'
	},
	'Social Science Anthropology': {
		tag: 'ssc-an',
		id: 76,
		categoryName: 'Social Science'
	},
	'Social Science Economics': {
		tag: 'ssc-ec',
		id: 56,
		categoryName: 'Social Science'
	},
	'Social Science Linguistics': {
		tag: 'ssc-li',
		id: 75,
		categoryName: 'Social Science'
	},
	'Social Science Other': {
		tag: 'ssc-ot',
		id: 60,
		categoryName: 'Social Science'
	},
	'Social Science Political Science': {
		tag: 'ssc-ps',
		id: 71,
		categoryName: 'Social Science'
	},
	'Social Science Psychology': {
		tag: 'ssc-py',
		id: 73,
		categoryName: 'Social Science'
	},
	'Social Science Sociology': {
		tag: 'ssc-so',
		id: 0,
		categoryName: 'Social Science'
	},
	'Trash American': {
		tag: 'tra-am',
		id: 32,
		categoryName: 'Trash'
	},
	'Trash Movies': {
		tag: 'tra-mo',
		id: 72,
		categoryName: 'Trash'
	},
	'Trash Music': {
		tag: 'tra-mu',
		id: 67,
		categoryName: 'Trash'
	},
	'Trash Other': {
		tag: 'tra-ot',
		id: 59,
		categoryName: 'Trash'
	},
	'Trash Sports': {
		tag: 'tra-sp',
		id: 55,
		categoryName: 'Trash'
	},
	'Trash Television': {
		tag: 'tra-tv',
		id: 70,
		categoryName: 'Trash'
	},
	'Trash Video Games': {
		tag: 'tra-vg',
		id: 53,
		categoryName: 'Trash'
	}
} as Record<Subcategory, ISubcategory>;
