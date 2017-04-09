import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { findWithClass, findWithType } from 'react-shallow-testutils';
import { spy, stub } from 'sinon';
import request from 'superagent-bluebird-promise';
import moment from 'moment';
import { createNew } from 'src/js/store';
import { initialState } from 'src/js/reducers/staff';
import noop from '../../../lib/util/noop';
import Nav from '../components/nav';
import StaffFormConnected, { StaffForm } from '../components/staff-form';
import StaffMember from '../components/staff-member';
import BookingConfirmation from '../components/booking-confirmation';

describe('<StaffForm>', () => {
    context('when rendered with required props for StaffForm', () => {
        const today = moment.utc();
        const props = {
            id: 10001,
            date: today,
            imagePath: 'http://i.pravatar.cc/300?img=25',
            name: 'Peter Pickler',
            startTime: '10:15 AM',
            endTime: '11:15 AM'
        };

        let component;

        before(() => {
            component = renderShallow(
              <StaffForm {...props} />).output;
        });

        it('renders report form with default values', () => {
            expect(component).to.eql(
              <div className="staff-form">
                <Nav leftClick={noop}>
                  <StaffMember imagePath="http://i.pravatar.cc/300?img=25" name="Peter Pickler" />
                </Nav>

                <div className="staff-slots-date">
                  <p>{today.format('dddd, do MMM YYYY')}</p>
                  <p>10:15 AM - 11:15 AM</p>
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
                  <button onClick={noop}className="staff-form__confirm-btn">Confirm Booking</button>
                </div>
              </div>
            );
        });
    });

    context('when go back button is clicked', () => {
        const props = {
            id: 10001,
            date: moment.utc('2017-02-01'),
            imagePath: 'http://i.pravatar.cc/300?img=25',
            name: 'Peter Pickler',
            startTime: '10:15 AM',
            endTime: '11:15 AM',
            navigationController: {
                popView: spy()
            }
        };

        before(() => {
            const component = renderShallow(
              <StaffForm {...props} />
            ).output;

            const navElement = findWithType(component, Nav);
            navElement.props.leftClick();
        });

        it('calls the popView function of navigationController', () => {
            expect(props.navigationController.popView).to.have.been.calledOnce();
        });
    });
    context('when confirm booking is clicked', () => {
        const today = moment.utc();
        const formattedDate = today.format('YYYY-MM-DD');
        const props = {
            id: 10001,
            date: today,
            imagePath: 'http://i.pravatar.cc/300?img=25',
            name: 'Peter Pickler',
            startTime: '10:15 AM',
            endTime: '11:15 AM',
            navigationController: {
                pushView: spy()
            }
        };
        const body = {
            resourceId: props.id,
            date: formattedDate,
            time: props.startTime,
            duration: 60
        };

        before((done) => {
            stub(request, 'post').returns(Promise.resolve({}));
            const component = renderShallow(
              <StaffForm {...props} />
            ).output;

            const navElement = findWithClass(component, 'staff-form__confirm-btn');
            setTimeout(() => {
                navElement.props.onClick();
                done();
            });
        });

        it('calls bookings endpoint', () => {
            expect(request.post).to.have.been.calledWith(
                '/bookings/new', body
            );
        });

        it('calls the pushView function of navigationController', () => {
            expect(props.navigationController.pushView).to.have.been.calledWith(
              <BookingConfirmation
                  imagePath={props.imagePath} name={props.name}
                  startTime={props.startTime} endTime={props.endTime}
                  date={formattedDate}
              />, { transition: 0 }
            );
        });
    });
    context('when it is connected', () => {
        let store;
        let component;
        const navigationController = {
            pushView: noop
        };
        const currentDate = moment();
        const startTime = '10:15 AM';
        const endTime = '11:15 AM';
        const selectedStaffMember = {
            id: 10004,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry'
        };

        before(() => {
            store = createNew({ staff: { ...initialState, selectedStaffMember } });
            component = renderShallow(
              <StaffFormConnected
                  store={store}
                  navigationController={navigationController}
                  date={currentDate}
                  startTime={startTime}
                  endTime={endTime}
              />
            ).output;
        });
        it('renders StaffForm with store and its dispatch', () => {
            expect(component).to.eql(
              <StaffForm
                  dispatch={noop}
                  store={store}
                  imagePath={selectedStaffMember.imagePath}
                  name={selectedStaffMember.name}
                  navigationController={navigationController}
                  date={currentDate}
                  startTime={startTime}
                  endTime={endTime}
                  id={selectedStaffMember.id}
              />
            );
        });
    });
});
