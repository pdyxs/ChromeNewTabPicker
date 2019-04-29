import {compose, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import navigation from 'modules/navigation';
import tabs from 'modules/tabs';

import { combineReducers, install } from 'redux-loop';

const store = createStore(combineReducers({
  navigation,
  tabs
}), {}, compose(
  install(),
  applyMiddleware(thunk)
));

export default store;
