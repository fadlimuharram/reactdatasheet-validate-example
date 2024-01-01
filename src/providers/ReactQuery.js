import { FC, ReactNode } from 'react'
import {
  Hydrate,
  HydrateProps,
  QueryClient,
  QueryClientProvider as QueryProvider,
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const QueryClientProvider= ({ children, hydrateState }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        notifyOnChangeProps: 'tracked',
        staleTime: 5000,
      },
    },
  })
  return (
    <QueryProvider client={queryClient}>
      <Hydrate state={hydrateState}>{children}</Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  )
}

export default QueryClientProvider
