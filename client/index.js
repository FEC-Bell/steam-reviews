import React from 'react';
import ReactDOM from 'react-dom';
import { getPathId } from './utils';
import ReviewsModule from './src/ReviewsModule';

ReactDOM.render(<ReviewsModule gameid={getPathId()}/>, document.getElementById('reviews'));