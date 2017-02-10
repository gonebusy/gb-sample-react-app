import React, { Component, PropTypes } from 'react';
import DayPicker from 'react-day-picker';
import Nav from './nav';
import StaffMember from './staff-member';
import StaffSlots from './staff-slots';

class StaffCalendar extends Component {
    handleDayClick = () =>
        (e, day) => {
            this.props.navigationController.pushView(<StaffSlots date={day} {...this.props} />);
        };

    goBack = () => {
        this.props.navigationController.popView();
    }

    render() {
        return (
          <div className="staff-calendar">
            <Nav leftClick={() => this.goBack()}>
              <StaffMember imagePath={this.props.imagePath} name={this.props.name} />
            </Nav>

            <div className="staff-calendar-picker">
              <DayPicker
                  onDayClick={this.handleDayClick()}
                  weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
              />
            </div>
          </div>
        );
    }
}

StaffCalendar.defaultProps = {
    navigationController: Object()
};

StaffCalendar.propTypes = {
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    navigationController: PropTypes.object
};

export default StaffCalendar;
