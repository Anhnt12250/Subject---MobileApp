import React, { Component } from "react";
import Main from "./components/MainComponent";
import { LogBox } from "react-native";

// redux
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/ConfigureStore';
const { store }= ConfigureStore();

// redux-persist
import { PersistGate } from 'redux-persist/es/integration/react';
const { persistor } = ConfigureStore();

class App extends Component {
  constructor(props) {
    super(props);
    LogBox.ignoreLogs([
      'TextElement: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
    ]);
  }

  render() {    
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Main />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;