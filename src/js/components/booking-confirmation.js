import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export const BookingConfirmation = ({ imagePath, name, date, startTime, endTime }) =>
  <div className="booking-confirmation">
    <p>Booking Confirmed!</p>
    <p>{date}</p>
    <p>{startTime} - {endTime}</p>
    <div>
      <img
          className="booking-confirmation__image"
          src={imagePath}
          alt={name}
      />
      <p>{name}</p>
    </div>
  </div>;

BookingConfirmation.propTypes = {
    date: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

export const mapStateToProps = (
    { staff: { selectedStaffMember: { imagePath, name } } }
) => ({
    imagePath, name
});

export default connect(mapStateToProps)(BookingConfirmation);
