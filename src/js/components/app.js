import React, { Component } from 'react';
import { Provider } from 'react-redux';
import NavigationController from 'react-navigation-controller';
import { fetchStaff } from 'src/js/actions/staff';
import StaffPicker from './staff-picker';
import store from '../store';
import '../../scss/main.scss';

class App extends Component {
    componentWillMount() {
        fetchStaff()(store.dispatch);
    }

    render() {
        return (
          <Provider store={store}>
            <NavigationController
                views={[<StaffPicker />]}
                preserveState
                transitionTension={10}
                transitionFriction={6}
            />
          </Provider>
        );
    }
}

export default App;
