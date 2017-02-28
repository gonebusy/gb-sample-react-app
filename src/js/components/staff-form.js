import React, { Component, PropTypes } from 'react';
import Nav from './nav';
import StaffMember from './staff-member';

class StaffForm extends Component {
    goBack = () => {
        this.props.navigationController.popView();
    };

    render() {
        return (
          <div className="staff-form">
            <Nav leftClick={() => this.goBack()}>
              <StaffMember imagePath={this.props.imagePath} name={this.props.name} />
            </Nav>

            <div className="staff-slots-date">{this.props.slot}</div>

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
    }
}

StaffForm.defaultProps = {
    navigationController: Object()
};

StaffForm.propTypes = {
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slot: PropTypes.string.isRequired,
    navigationController: PropTypes.object
};

export default StaffForm;
