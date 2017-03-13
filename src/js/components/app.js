import React from 'react';
import { Provider } from 'react-redux';
import NavigationController from 'react-navigation-controller';
import StaffPicker from './staff-picker';
import store from '../store';
import '../../scss/main.scss';

const App = () =>
  <Provider store={store}>
    <NavigationController
        views={[<StaffPicker />]}
        preserveState
        transitionTension={10}
        transitionFriction={6}
    />
  </Provider>;

export default App;
