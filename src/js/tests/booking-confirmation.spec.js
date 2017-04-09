import { expect } from 'chai';
import dateFormat from 'dateformat';
import React from 'react';
import renderShallow from 'render-shallow';
import BookingConfirmation from '../components/booking-confirmation';

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
});
