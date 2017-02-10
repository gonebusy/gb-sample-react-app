import React from 'react';
import NavigationController from 'react-navigation-controller';
import StaffPicker from './staff-picker';

import '../../scss/main.scss';

const App = () =>
  <NavigationController
      views={[<StaffPicker />]}
      preserveState
      transitionTension={10}
      transitionFriction={6}
  />;

export default App;
