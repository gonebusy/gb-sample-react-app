import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Routes from 'src/js/routes';
import { fetchStaff } from 'src/js/actions/staff';
import store from '../store';
import '../../scss/main.scss';

class App extends Component {
    componentWillMount() {
        store.dispatch(fetchStaff());
    }

    render() {
        return (
          <Provider store={store}>
            <div className="ReactNavigationController">
              <Routes dispatch={store.dispatch} getState={store.getState} />
            </div>
          </Provider>
        );
    }
}

export default App;
