import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export const BookingConfirmation = ({ imagePath, name, date, startTime, endTime }) =>
  <div className="booking-confirmation">
    <p>Booking Confirmed!</p>
    <p>{date.format('YYYY-MM-DD')}</p>
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
    date: PropTypes.object.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

export const mapStateToProps = (
    { staff: { selectedStaffMember: { imagePath, name, selectedDate, startTime, endTime } } }
) => ({
    imagePath, name, date: selectedDate, startTime, endTime
});

export default connect(mapStateToProps)(BookingConfirmation);
