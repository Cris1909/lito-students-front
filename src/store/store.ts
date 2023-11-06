import { configureStore } from '@reduxjs/toolkit'

import { authSlice } from './reducers/auth'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch