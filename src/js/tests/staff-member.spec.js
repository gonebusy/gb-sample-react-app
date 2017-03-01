import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import noop from '../../../lib/util/noop';
import StaffMember from '../components/staff-member';

describe('<StaffMember>', () => {
    context('when rendered with props', () => {
        let component;
        let handleClick;
        const props = {
            imagePath: 'some/path',
            name: 'someName',
            onStaffClick: noop
        };

        before(() => {
            const { instance: getInstance, output } = renderShallow(<StaffMember {...props} />);
            const instance = getInstance();
            handleClick = instance.handleClick;
            component = output;
        });

        it('renders a staff member', () => {
            expect(component).to.eql(
              <div onClick={handleClick(props)} className="staff-member">
                <div className="staff-member__avatar">
                  <img
                      className="staff-member__image"
                      src={props.imagePath}
                      alt={props.name}
                  />
                </div>
                <div className="staff-member__name">{props.name}</div>
              </div>
            );
        });
    });

    context('when staff member is clicked', () => {
        const props = {
            imagePath: 'some/path',
            name: 'someName',
            onStaffClick: spy()
        };

        before(() => {
            const { instance: getInstance } = renderShallow(<StaffMember {...props} />);
            const instance = getInstance();
            instance.handleClick(props)();
        });

        it('calls onStaffClick', () => {
            expect(props.onStaffClick).to.have.been.calledOnce();
        });
    });

});
