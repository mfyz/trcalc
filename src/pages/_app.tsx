import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useTheme } from "@/hooks/useTheme";

export default function App({ Component, pageProps }: AppProps) {
  useTheme();

  return <Component {...pageProps} />;
}
