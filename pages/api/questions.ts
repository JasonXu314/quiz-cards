import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { compileQuestionRequest } from '../../util/util';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const preFormatReq = {
		categories: null,
		limit: null,
		subcategories: null,
		difficulty: null,
		internal: false
	};

	if (typeof req.query.categories === 'string') {
		preFormatReq.categories = [...req.query.categories.split(/,\s?/)];
	}
	else {
		res.status(400).json('Categories should be a single string of comma-separated values');
	}

	if (typeof req.query.subcategories === 'string') {
		preFormatReq.subcategories = [...req.query.subcategories.split(/,\s?/)];
	}
	else {
		res.status(400).json('Subcategories should be a single string of comma-separated values');
	}

	if (typeof req.query.limit === 'string') {
		preFormatReq.limit = parseInt(req.query.limit);
	}
	else {
		res.status(400).json('Limit must be single value');
		return;
	}

	if (typeof req.query.difficulty === 'string') {
		preFormatReq.difficulty = parseInt(req.query.difficulty);
	}
	else {
		res.status(400).json('Difficulty must be single value');
	}

	const questions = (await axios(compileQuestionRequest(preFormatReq))).data;
	
	res.status(200).json(questions);
}