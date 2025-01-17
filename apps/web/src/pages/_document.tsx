/* eslint-disable jsx-a11y/iframe-has-title */
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import Script from 'next/script'
import { ServerStyleSheet } from 'styled-components'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      // eslint-disable-next-line no-param-reassign
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {process.env.NEXT_PUBLIC_NODE_PRODUCTION && (
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_NODE_PRODUCTION} />
          )}
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo.png" />
          <link rel="manifest" href="/manifest.json" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              const baseURL =
				"https://hashmail-widget-ts-js.vercel.app/bundle/notifier_tracking_script.js";
			let dapp_id = "3561612d-6bc3-4b61-881d-49bb5c8ac732"; // replace with dapp_id provided by hashmail
			!(function () {
				window.hashmail || (window.hashmail = []), (window.hashmail.queue = []);
				let i = ["load", "identify", "track"],
					t = function (i) {
						return function () {
							(a = Array.prototype.slice.call(arguments)),
								a.unshift(i),
								window.hashmail.queue.push(a);
						};
					};
				for (var e = 0; i.length > e; e++) window.hashmail[i[e]] = t(i[e]);
				(hashmail.methods = i),
					(window.hashmail.load = function (i, t) {
						(window.hashmail.dapp_id = i), (window.hashmail.settings = t);
						var e = document,
							s = e.getElementsByTagName("script")[0],
							h = e.createElement("script");
						(h.type = "text/javascript"),
							(h.async = !0),
							(h.src = baseURL),
							s.parentNode.insertBefore(h, s);
					}),
					(window.hashmail.identify = (i) => {
						(window.hashmail.wallet_address = i),
							localStorage.setItem("hashmail-wallet_address", i);
					}),
					window.hashmail.load(dapp_id);
			})();
          `,
            }}
            type="text/javascript"
          />
        </Head>
        <body>
          <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-ZER0X0YN79" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-ZER0X0YN79', {
            'storage': 'none'
          });
          gtag('set', 'allowAdFeatures', false);
          `}
          </Script>

          <Main />
          <NextScript />
          <div id="portal-root" />
        </body>
      </Html>
    )
  }
}

export default MyDocument
