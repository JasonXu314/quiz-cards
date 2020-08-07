import { compileQuestionRequest } from '@/util';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse<QuestionResponse | string>): Promise<void> => {
	const preFormatReq: any = {
		categories: null,
		limit: null,
		subcategories: null,
		difficulties: null,
		internal: false
	};

	if (typeof req.query.categories === 'string') {
		preFormatReq.categories = [...req.query.categories.split(/,\s?/)];
	} else {
		res.status(400).json('Categories should be a single string of comma-separated values');
		return;
	}

	if (typeof req.query.subcategories === 'string') {
		preFormatReq.subcategories = [...req.query.subcategories.split(/,\s?/)];
	} else {
		res.status(400).json('Subcategories should be a single string of comma-separated values');
		return;
	}

	if (typeof req.query.limit === 'string') {
		preFormatReq.limit = parseInt(req.query.limit);
	} else {
		res.status(400).json('Limit must be single value');
		return;
	}

	if (typeof req.query.difficulties === 'string') {
		preFormatReq.difficulties = [...req.query.difficulties.split(/,\s?/).map((diff) => parseInt(diff))];
	} else {
		res.status(400).json('Difficulty must be single value');
		return;
	}

	const data = (await axios.get<QuizDBResponse>(compileQuestionRequest(preFormatReq))).data.data;

	res.status(200).json({ questions: data.tossups, num_questions_found: data.num_tossups_found });
};

`https://www.quizdb.org/api/random?search%5Bquery%5D=&search%5Bfilters%5D%5Bcategory%5D%5B%5D=17&search%5Bfilters%5D%5Bsubcategory%5D%5B%5D=23&search%5Bfilters%5D%5Bdifficulty%5D%5B%5D=regular_high_school&search%5Bfilters%5D%5Bdifficulty%5D%5B%5D=hard_high_school&search%5Blimit%5D=true&search%5Brandom%5D=50`;
