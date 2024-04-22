import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slice/taskSlice";

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
