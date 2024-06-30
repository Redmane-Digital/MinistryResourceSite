import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/';
import { Provider } from 'react-redux';
import StorefrontContext from '../plugins/shopify';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

const wrapRootElement = ({ element }) => {
    return (
        <Provider store={store}>
            <StorefrontContext>
                {element}
            </StorefrontContext>
        </Provider>
    )
};

export default wrapRootElement;