import { configureStore } from '@reduxjs/toolkit';
import floor from '../pages/slices/floor.slice';
import widgets from '../widgets/store';
export const store = configureStore({
  reducer: { floor, widgets },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
