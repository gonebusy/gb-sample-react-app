import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import request from 'superagent-bluebird-promise';
import Nav from './nav';
import StaffMember from './staff-member';
import BookingConfirmation from './booking-confirmation';

export class StaffForm extends Component {
    goBack() {
        this.props.navigationController.popView();
    }
    confirmBooking() {
        return () => {
            const { startTime, endTime, date, id, imagePath, name } = this.props;
            const formattedDate = date.format('YYYY-MM-DD');
            const duration = moment(`${formattedDate} ${endTime}`, ['YYYY-MM-DD h:mm A']).diff(
                moment(`${formattedDate} ${startTime}`, ['YYYY-MM-DD h:mm A']), 'minutes');
            const body = {
                resourceId: id,
                date: formattedDate,
                time: startTime,
                duration
            };
            request.post('/bookings/new', body).then(() => {
                this.props.navigationController.pushView(
                  <BookingConfirmation
                      imagePath={imagePath} name={name}
                      startTime={startTime} endTime={endTime}
                      date={formattedDate}
                  />, { transition: 0 });
            });
        };
    }

    render() {
        return (
          <div className="staff-form">
            <Nav leftClick={() => this.goBack()}>
              <StaffMember imagePath={this.props.imagePath} name={this.props.name} />
            </Nav>
            <div className="staff-slots-date">
              <p>{this.props.date.format('dddd, do MMM YYYY')}</p>
              <p>{this.props.startTime} - {this.props.endTime}</p>
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
              <button onClick={this.confirmBooking()} className="staff-form__confirm-btn">
                  Confirm Booking
              </button>
            </div>

          </div>
        );
    }
}

StaffForm.defaultProps = {
    navigationController: Object(),
};

StaffForm.propTypes = {
    id: PropTypes.number.isRequired,
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    navigationController: PropTypes.object,
    date: PropTypes.object.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired
};

const mapStateToProps = (
    {
        staff: {
            selectedStaffMember: {
                id,
                name,
                imagePath
            }
        }
    }) => ({
        id,
        name,
        imagePath
    });

export default connect(mapStateToProps)(StaffForm);
