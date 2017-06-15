import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import { findWithType } from 'react-shallow-testutils';
import noop from '../../../lib/util/noop';
import Slot from '../components/slot';

describe('<Slot>', () => {
    context('when component renders and is not disabled', () => {
        let component;
        const time = '8:00 PM';
        before(() => {
            component = renderShallow(
              <Slot time={time} timeClick={() => noop} index={1} disabled={false} />
            ).output;
        });

        it('renders <Slot>', () => {
            expect(component).to.eql(
              <li className="staff-slots-time" >
                <button onClick={noop} disabled={false}>{time}</button>
              </li>
            );
        });

    });

    context('when component renders and is disabled', () => {
        let component;
        const time = '8:00 PM';
        before(() => {
            component = renderShallow(
              <Slot time={time} timeClick={() => noop} index={1} disabled />
            ).output;
        });

        it('renders <Slot>', () => {
            expect(component).to.eql(
              <li className="staff-slots-time" >
                <button onClick={noop} disabled>{time}</button>
              </li>
            );
        });

    });

    context('when button is clicked', () => {
        const time = '8:00 PM';
        const timeClick = spy();
        before((done) => {
            const component = renderShallow(
              <Slot time={time} timeClick={() => timeClick} index={1} disabled={false} />
            ).output;
            const button = findWithType(component, 'button');
            setTimeout(() => {
                button.props.onClick();
                done();
            });
        });

        it('calls timeClick', () => {
            expect(timeClick).to.have.been.called();
        });

    });
});
