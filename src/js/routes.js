import React, { PropTypes } from 'react';
import { browserHistory, Route, Router, IndexRoute } from 'react-router';
import Nav from 'src/js/components/nav';
import StaffPicker from 'src/js/components/staff-picker';
import StaffCalendar from 'src/js/components/staff-calendar';
import StaffSlots from 'src/js/components/staff-slots';
import StaffForm from 'src/js/components/staff-form';
import BookingConfirmation from 'src/js/components/booking-confirmation';
import { fetchSlotsForResource } from 'src/js/actions/staff';
import moment from 'moment';

const Routes = ({ dispatch, getState }) => (
  <Router history={browserHistory}>
    <Route component={Nav}>
      <Route
          path="/"
          component={StaffPicker}
      />
      <Route
          path="staff/:id"
          onEnter={
                  (nextState) => {
                      const { params: { id } } = nextState;
                      fetchSlotsForResource(moment.utc(), id)(dispatch, getState);
                  }
              }
      >
        <IndexRoute component={StaffCalendar} />
        <Route path="available_slots/:date" component={StaffSlots} />
        <Route path="book" component={StaffForm} />
      </Route>
      <Route path="confirm" component={BookingConfirmation} />
    </Route>
  </Router>

);

Routes.propTypes = {
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
};

export default Routes;
