import { expect } from 'chai';
import dateFormat from 'dateformat';
import React from 'react';
import renderShallow from 'render-shallow';
import { initialState } from 'src/js/reducers/staff';
import { createNew } from 'src/js/store';
import noop from '../../../lib/util/noop';
import
    BookingConfirmationConnected,
    { BookingConfirmation }
from '../components/booking-confirmation';

describe('<BookingConfirmation>', () => {
    context('when rendered with required props for BookingConfirmation', () => {
        const props = {
            date: `${dateFormat(new Date('2017-02-01'), 'dddd, d mmm yyyy', true)}`,
            imagePath: 'http://i.pravatar.cc/300?img=25',
            name: 'Peter Pickler',
            startTime: '10:15 AM',
            endTime: '11:15 AM'
        };

        let component;

        before(() => {
            component = renderShallow(
              <BookingConfirmation {...props} />).output;
        });

        it('renders booking confirmation', () => {
            expect(component).to.eql(
              <div className="booking-confirmation">
                <p>Booking Confirmed!</p>
                <p>{props.date}</p>
                <p>{props.startTime} - {props.endTime}</p>
                <div>
                  <img
                      className="booking-confirmation__image"
                      src={props.imagePath}
                      alt={props.name}
                  />
                  <p>{props.name}</p>
                </div>
              </div>
            );
        });
    });

    context('when it is connected', () => {
        let store;
        let component;
        const selectedStaffMember = {
            id: 10004,
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry'
        };
        const props = {
            date: `${dateFormat(new Date('2017-02-01'), 'dddd, d mmm yyyy', true)}`,
            startTime: '10:15 AM',
            endTime: '11:15 AM'
        };

        before(() => {
            store = createNew({ staff: { ...initialState, selectedStaffMember } });
            component = renderShallow(
              <BookingConfirmationConnected
                  store={store}
                  {...props}
              />
            ).output;
        });

        it('renders BookingConfirmation', () => {
            expect(component).to.eql(
              <BookingConfirmation
                  dispatch={noop}
                  imagePath={selectedStaffMember.imagePath}
                  name={selectedStaffMember.name}
                  store={store}
                  {...props}
              />
            );
        });
    });
});
