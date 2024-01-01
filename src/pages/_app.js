import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import QueryClientProvider from "../providers/ReactQuery";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider hydrateState={pageProps.dehydratedState}>
      <AppCacheProvider {...pageProps}>
        <div>
          <Toaster />
        </div>

        <Component {...pageProps} />
      </AppCacheProvider>
    </QueryClientProvider>
  );
}
