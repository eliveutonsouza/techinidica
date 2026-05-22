// Entry point: pin React on window so legacy globals work, then load prototype
// modules in dependency order (they each Object.assign(window, ...)), and
// finally hand off to App, which renders Root via ReactDOM.
import React from 'react';
import * as ReactDOM from 'react-dom/client';

(window as any).React = React;
(window as any).ReactDOM = ReactDOM;

import './data';
import './ui';
import './public-shell';
import './public-pages';
import './admin-shell';
import './admin-pages';
import './app';
