import dateFormat from 'dateformat';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Nav from './nav';
import StaffMember from './staff-member';
import StaffForm from './staff-form';

export const StaffSlots = ({ imagePath, name, navigationController, date, slots }) => {
    const formattedDate = dateFormat(date, 'dddd, d mmm yyyy');

    const goBack = () => {
        navigationController.popView();
    };

    const timeClick = time => () => {
        navigationController.pushView(
          <StaffForm
              imagePath={imagePath}
              name={name}
              slot={`${formattedDate} ${time}`}
              navigationController={navigationController}
          />);
    };
    const renderSlot = (time, index) => (
      <li className="staff-slots-time" key={index}>
        <button onClick={timeClick(time)}>{time}</button>
      </li>
    );
    return (
      <div className="staff-slots">
        <Nav leftClick={() => goBack()}>
          <StaffMember imagePath={imagePath} name={name} />
        </Nav>

        <div className="staff-slots-date">{formattedDate}</div>
        {
            slots.length ?
              <ul className="staff-slots-times">
                { slots.map(renderSlot) }
              </ul>
              :
              <p className="staff-slots-message">No slots available!</p>
        }
      </div>
    );
};

StaffSlots.propTypes = {
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
    slots: PropTypes.array.isRequired,
    navigationController: PropTypes.object.isRequired
};


const mapStateToProps = (
    {
        staff: {
            selectedStaffMember: {
                imagePath, name, selectedDate, slotsForDate
            }
        }
    }) => ({
        imagePath,
        name,
        date: selectedDate,
        slots: slotsForDate
    });

export default connect(mapStateToProps)(StaffSlots);
