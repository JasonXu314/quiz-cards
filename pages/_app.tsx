import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import '../sass/global.scss';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<RecoilRoot>
			<Component {...pageProps} />
		</RecoilRoot>
	);
};

export default MyApp;
