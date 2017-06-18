import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'halogen/ClipLoader';

export const BookingConfirmation = ({ imagePath, name, date, startTime, endTime, loading }) =>
  <div className="booking-confirmation">
    { loading ?
      <Loader className="loader" color="#000000" size="50px" margin="4px" /> :
      <section>
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
      </section>
      }
  </div>;

BookingConfirmation.propTypes = {
    date: PropTypes.object.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired
};

export const mapStateToProps = (
    { staff:
        {
            selectedStaffMember: { imagePath, name, selectedDate, startTime, endTime },
            loading
        }
    }
) => ({
    imagePath, name, date: selectedDate, startTime, endTime, loading
});

export default connect(mapStateToProps)(BookingConfirmation);
