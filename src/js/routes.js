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
import SlideLeft from 'src/js/components/slide-left-route-transition';

const Routes = ({ dispatch }) => (
  <Router history={browserHistory}>
    <Route path="/" component={Nav}>
      <IndexRoute component={StaffPicker} />
      <Route
          path="staff/:id"
          onEnter={
                  (nextState) => {
                      const { params: { id } } = nextState;
                      dispatch(fetchSlotsForResource(moment.utc(), id));
                  }
              }
          component={SlideLeft}
      >
        <IndexRoute component={StaffCalendar} />
        <Route path="available_slots/:date/start" component={StaffSlots} />
        <Route path="available_slots/:date/end" component={StaffSlots} />
        <Route path="book" component={StaffForm} />
      </Route>
      <Route path="confirm" component={SlideLeft}>
        <IndexRoute component={BookingConfirmation} />
      </Route>
    </Route>
  </Router>

);

Routes.propTypes = {
    dispatch: PropTypes.func.isRequired
};

export default Routes;
