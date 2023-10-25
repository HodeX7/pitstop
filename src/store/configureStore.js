import { configureStore } from "@reduxjs/toolkit";
import formReducer from "../features/formSlice";

export default configureStore({
  reducer: {
    form: formReducer,
  },
});
