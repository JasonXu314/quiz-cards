import { RecoilRoot } from 'recoil';
import '../sass/global.scss';

const MyApp = ({ Component, pageProps }) => {
	return (
		<RecoilRoot>
			<Component {...pageProps} />
		</RecoilRoot>
	);
};

export default MyApp;
