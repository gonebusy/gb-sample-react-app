import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { initialState } from 'src/js/reducers/staff';
import { createNew } from 'src/js/store';
import moment from 'moment';
import Loader from 'halogen/ClipLoader';
import uuidv1 from 'uuid/v1';
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
            endTime: '11:15 AM',
            loading: false
        };

        let component;

        before(() => {
            component = renderShallow(
              <BookingConfirmation {...props} />).output;
        });

        it('renders booking confirmation', () => {
            expect(component).to.eql(
              <div className="booking-confirmation">
                <section>
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
                </section>
              </div>
            );
        });
    });

    context('when it is loading', () => {
        const props = {
            date: moment.utc(),
            imagePath: 'http://i.pravatar.cc/300?img=25',
            name: 'Peter Pickler',
            startTime: '10:15 AM',
            endTime: '11:15 AM',
            loading: true
        };

        let component;

        before(() => {
            component = renderShallow(
              <BookingConfirmation {...props} />).output;
        });

        it('renders booking confirmation', () => {
            expect(component).to.eql(
              <div className="booking-confirmation">
                <Loader className="loader" color="#000000" size="50px" margin="4px" />
              </div>
            );
        });
    });

    context('when it is connected', () => {
        let store;
        let component;
        const selectedStaffMember = {
            id: uuidv1(),
            imagePath: 'http://i.pravatar.cc/300?img=15',
            name: 'Phillip Fry',
            startTime: '10:15 AM',
            endTime: '11:15 AM',
            selectedDate: moment.utc(),
        };

        before(() => {
            store = createNew({ staff: { ...initialState, selectedStaffMember, loading: false } });
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
                  loading={false}
              />
            );
        });
    });
});
