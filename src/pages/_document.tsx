import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" style={{ background: '#f9fafb' }}>
      <Head />
      <body className="antialiased" style={{ background: '#f9fafb' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
