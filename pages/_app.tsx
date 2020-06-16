import { NextComponentType } from 'next';
import { RecoilRoot } from 'recoil';
import '../sass/global.scss';

const MyApp: React.FC<{ Component: NextComponentType; pageProps: any }> = ({ Component, pageProps }) => {
	return (
		<RecoilRoot>
			<Component {...pageProps} />
		</RecoilRoot>
	);
};

export default MyApp;
