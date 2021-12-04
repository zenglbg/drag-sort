import React, { Component } from 'react';
import { render } from 'react-dom';
import DragSort from './drag-sort';

import './style.css';

interface AppProps {}
interface AppState {
  name: string;
}

class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
  }

  render() {
    return <DragSort />;
  }
}

render(<App />, document.getElementById('root'));
