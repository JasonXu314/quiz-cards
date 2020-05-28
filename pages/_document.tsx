import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document<{ path: string }> {
	static async getInitialProps(ctx: DocumentContext) {
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
		const { path } = this.props;
		let displayPath = '';

		if (path !== 'edit/[_id]') {
			displayPath = path.slice(0, 1).toUpperCase() + path.slice(1);
		}

		return (
			<Html lang="en">
				<head>
					<Head />
					<title>QuizCards - {displayPath}</title>
				</head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
