// store.js
import { createStore } from 'redux';
import rootReducer from './reducer'; // Combine your reducers here

const store = createStore(rootReducer);

export default store;