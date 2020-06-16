import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';

interface MyDocumentInitialProps extends DocumentInitialProps {
	path: string;
}

class MyDocument extends Document<{ path: string }> {
	static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx);

		if (ctx.asPath === '/edit/') {
			ctx.res.writeHead(301, {
				Location: '/edit'
			});
			ctx.res.end();
		}

		return { ...initialProps, path: ctx.pathname.slice(1) };
	}

	render() {
		return (
			<Html lang="en">
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
