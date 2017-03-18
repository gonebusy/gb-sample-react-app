import React, { PropTypes } from 'react';
import Nav from './nav';
import StaffMember from './staff-member';

const StaffForm = ({ imagePath, name, slot, navigationController }) => {
    const goBack = () => {
        navigationController.popView();
    };

    return (
      <div className="staff-form">
        <Nav leftClick={() => goBack()}>
          <StaffMember imagePath={imagePath} name={name} />
        </Nav>

        <div className="staff-slots-date">{slot}</div>

        <div className="staff-form__form">
          <div className="staff-form__form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" required="required" />
          </div>
          <div className="staff-form__form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" required="required" />
          </div>
          <button className="staff-form__confirm-btn">Confirm Booking</button>
        </div>
      </div>
    );
};

StaffForm.propTypes = {
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    navigationController: PropTypes.object.isRequired,
    slot: PropTypes.string.isRequired
};

export default StaffForm;
