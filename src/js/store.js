import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';

const initialState = {};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const createNew = (state = initialState) => (
    createStore(
        combineReducers(reducers),
        state,
        composeEnhancers(
            applyMiddleware(thunk)
        )
    )
);

export default createNew();
