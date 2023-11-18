import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { userSlice } from '../store/reducers/userSlice'

// create a new mutex
const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_API_URL}`,
  prepareHeaders: async headers => {
    const accessToken = localStorage.getItem('accessToken')
 
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
 
    return headers
  },
})
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
          '/user/refresh',
          api,
          extraOptions
        )
        if (refreshResult.data) {
          const refeshTokenResult = refreshResult.data as any

          // store the new token
          localStorage.setItem('accessToken', refeshTokenResult.accessToken)
          // retry the initial query
          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(userSlice.actions.setUser(null));
        }
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}