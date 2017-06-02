import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { initialState } from 'src/js/reducers/staff';
import { createNew } from 'src/js/store';
import moment from 'moment';
import noop from '../../../lib/util/noop';
import
    BookingConfirmationConnected,
    { BookingConfirmation }
from '../components/booking-confirmation';

describe('<BookingConfirmation>', () => {
    context('when rendered with required props for BookingConfirmation', () => {
        const props = {
            date: moment.utc(),
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
                <p>{props.date.format('YYYY-MM-DD')}</p>
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
            name: 'Phillip Fry',
            startTime: '10:15 AM',
            endTime: '11:15 AM',
            selectedDate: moment.utc()
        };

        before(() => {
            store = createNew({ staff: { ...initialState, selectedStaffMember } });
            component = renderShallow(
              <BookingConfirmationConnected
                  store={store}
              />
            ).output;
        });

        it('renders BookingConfirmation', () => {
            expect(component).to.eql(
              <BookingConfirmation
                  dispatch={noop}
                  store={store}
                  date={selectedStaffMember.selectedDate}
                  imagePath={selectedStaffMember.imagePath}
                  startTime={selectedStaffMember.startTime}
                  endTime={selectedStaffMember.endTime}
                  name={selectedStaffMember.name}
              />
            );
        });
    });
});
