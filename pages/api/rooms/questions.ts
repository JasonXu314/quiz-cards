import { compileQuestionRequest } from '@/util';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse<TossupQuestion | string>): Promise<void> => {
	switch (req.method) {
		case 'GET':
			const distro: Record<Category, number> = JSON.parse(req.query.distro! as string);
			const difficulties: Difficulty[] = (req.query.difficulties! as string).split(/,\s?/).map(parseInt) as Difficulty[];
			const rand = Math.random() * 100;
			const litMin = 0;
			const sciMin = litMin + distro.Literature;
			const histMin = sciMin + distro.Science;
			const faMin = histMin + distro.History;
			const mythMin = faMin + distro['Fine Arts'];
			const relMin = mythMin + distro.Mythology;
			const geoMin = relMin + distro.Religion;
			const phiMin = geoMin + distro.Geography;
			const ceMin = phiMin + distro.Philosophy;
			const ssMin = ceMin + distro['Current Events'];
			const trashMin = ssMin + distro['Social Science'];
			let category: Category = 'Literature';

			if (rand > litMin) category = 'Literature';
			if (rand > sciMin) category = 'Science';
			if (rand > histMin) category = 'History';
			if (rand > faMin) category = 'Fine Arts';
			if (rand > mythMin) category = 'Mythology';
			if (rand > relMin) category = 'Religion';
			if (rand > geoMin) category = 'Geography';
			if (rand > phiMin) category = 'Philosophy';
			if (rand > ceMin) category = 'Current Events';
			if (rand > ssMin) category = 'Social Science';
			if (rand > trashMin) category = 'Trash';

			res.status(200).json(
				(await axios.get<QuizDBResponse>(compileQuestionRequest({ categories: [category], difficulties, internal: false, limit: 1, subcategories: [] })))
					.data.data.tossups[0]
			);
			break;
		default:
			res.status(405).send('Method not allowed');
			break;
	}
};
