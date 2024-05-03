// redux
import { createStore, combineReducers, applyMiddleware} from 'redux';
import logger from 'redux-logger';
// reducers
import { leaders } from './leaders';
import { dishes } from './dishes';
import { comments } from './comments';
import { promotions } from './promotions';

const thunk = require('redux-thunk').thunk;

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            leaders,
            dishes,
            comments,
            promotions
        }),
        applyMiddleware(thunk, logger)
    );
    return store;
}