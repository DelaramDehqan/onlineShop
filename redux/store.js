import {createStore, compose, applyMiddleware} from 'redux';
import {persistStore} from "redux-persist"
import rootReducer from "./root-reducer"
import thunk from 'redux-thunk'

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const persistor = persistStore(store)

export default store
export {persistor}

