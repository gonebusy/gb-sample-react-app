import React, { Component } from 'react';
import { Provider } from 'react-redux';
import NavigationController from 'react-navigation-controller';
import { fetchSlots, fetchStaff } from 'src/js/actions/staff';
import moment from 'moment';
import StaffPicker from './staff-picker';
import store from '../store';
import '../../scss/main.scss';

class App extends Component {
    componentWillMount() {
        const today = moment.utc();
        fetchStaff()(store.dispatch);
        fetchSlots(today)(store.dispatch, store.getState);
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
