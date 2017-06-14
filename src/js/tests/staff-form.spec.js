import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { findWithClass } from 'react-shallow-testutils';
import { spy, stub } from 'sinon';
import request from 'superagent-bluebird-promise';
import moment from 'moment';
import { createNew } from 'src/js/store';
import { initialState } from 'src/js/reducers/staff';
import noop from '../../../lib/util/noop';
import StaffFormConnected, { StaffForm } from '../components/staff-form';

describe('<StaffForm>', () => {
    context('when rendered with required props for StaffForm', () => {
        const today = moment.utc();
        const props = {
            id: '10001',
            date: today,
            startTime: '10:15 AM',
            endTime: '11:15 AM',
            router: {},
            style: { styleAttr: 'some-style' }
        };

        let component;

        before(() => {
            component = renderShallow(
              <StaffForm {...props} />).output;
        });

        it('renders report form with default values', () => {
            expect(component).to.eql(
              <div className="staff-form" style={props.style}>

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

    context('when confirm booking is clicked', () => {
        const today = moment.utc();
        const formattedDate = today.format('YYYY-MM-DD');
        const props = {
            id: '10001',
            date: today,
            startTime: '10:15 AM',
            endTime: '11:15 AM',
            router: {
                push: spy()
            },
            style: { styleAttr: 'some-style' }
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
                '/api/bookings/new', body
            );
        });

        it('calls the pushView function of navigationController', () => {
            expect(props.router.push).to.have.been.calledWith(
                '/confirm'
            );
        });
    });
    context('when it is connected', () => {
        let store;
        let component;
        const router = {
            push: noop
        };
        const currentDate = moment();
        const startTime = '10:15 AM';
        const endTime = '11:15 AM';
        const style = { styleAttr: 'some-style' };
        const selectedStaffMember = {
            id: '10004',
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
            selectedDate: currentDate,
            startTime,
            endTime
        };

        before(() => {
            store = createNew({ staff: { ...initialState, selectedStaffMember } });
            component = renderShallow(
              <StaffFormConnected
                  store={store}
                  router={router}
                  startTime={startTime}
                  endTime={endTime}
                  style={style}
              />
            ).output;
        });
        it('renders StaffForm with store and its dispatch', () => {
            expect(component).to.eql(
              <StaffForm
                  dispatch={noop}
                  store={store}
                  router={router}
                  date={currentDate}
                  startTime={startTime}
                  endTime={endTime}
                  id={selectedStaffMember.id}
                  style={style}
              />
            );
        });
    });
});
