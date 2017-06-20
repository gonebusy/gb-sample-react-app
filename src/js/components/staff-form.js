import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import request from 'superagent-bluebird-promise';
import { IS_LOADING, CLEAR_AVAILABLE_SLOTS } from 'src/js/action-types';
import Loader from 'halogen/ClipLoader';
import { fetchBookings } from 'src/js/actions/staff';

export const StaffForm = ({ startTime, endTime, date, id, router, style, dispatch, loading }) => {
    const confirmBooking = () => () => {
        const formattedDate = date.format('YYYY-MM-DD');
        const duration = moment(`${formattedDate} ${endTime}`, ['YYYY-MM-DD h:mm A']).diff(
                moment(`${formattedDate} ${startTime}`, ['YYYY-MM-DD h:mm A']), 'minutes');
        const body = {
            resourceId: id,
            date: formattedDate,
            time: startTime,
            duration
        };
        dispatch({ type: IS_LOADING, loading: true });
        request.post('/api/bookings/new', body).then(() => {
            dispatch({ type: CLEAR_AVAILABLE_SLOTS, id });
            dispatch(fetchBookings());
            router.push('/confirm');
        }).catch(() => {
            dispatch({ type: IS_LOADING, loading: false });
        });
    };

    return (
      <div className="staff-form" style={style}>
        { loading ?
          <Loader className="loader" color="#000000" size="50px" margin="4px" /> :
          <section>
            <div className="staff-slots-date">
              <p>{date.format('dddd, Do MMM YYYY')}</p>
              <p>{startTime} - {endTime}</p>
            </div>

            <div className="staff-form__form">
              <div className="staff-form__form-group">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" required="required" />
              </div>
              <div className="staff-form__form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" required="required" />
              </div>
              <button onClick={confirmBooking()} className="staff-form__confirm-btn">
                        Confirm Booking
                    </button>
            </div>
          </section>
        }
      </div>
    );
};

StaffForm.propTypes = {
    id: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};

const mapStateToProps = (
    {
        staff: {
            selectedStaffMember: {
                id, selectedDate, startTime, endTime
            },
            loading
        }
    }) => ({
        id,
        date: selectedDate,
        startTime,
        endTime,
        loading
    });

export default connect(mapStateToProps)(StaffForm);
