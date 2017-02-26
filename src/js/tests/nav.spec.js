import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import noop from '../../../lib/util/noop';
import mockEvent from '../../../lib/util/mock-event';
import Nav from '../components/nav';

describe('<Nav>', () => {
    context('when rendered without any props', () => {
        let component;
        before(() => {
            component = renderShallow(
              <Nav />).output;
        });

        it('renders without left and right navigation', () => {
            expect(component).to.eql(
              <div className="nav-header">
                <div className="nav-header--link" />
                <div className="nav-header--title" />
                <div className="nav-header--link" />
              </div>
            );
        });
    });

    context('when rendered with navigation props', () => {
        let component;
        const props = {
            leftClick: noop,
            rightClick: noop
        };

        before(() => {
            component = renderShallow(
              <Nav {...props} />).output;
        });

        it('renders with left and right navigation links', () => {
            expect(component).to.eql(
              <div className="nav-header">
                <div className="nav-header--link">
                  <a className="nav-header--prev" href="left" onClick={e => props.leftClick(e)} />
                </div>
                <div className="nav-header--title" />
                <div className="nav-header--link">
                  <a className="nav-header--next" href="right" onClick={e => props.rightClick(e)} />
                </div>
              </div>
            );
        });
    });

    context('when navigation links are clicked', () => {
        const props = {
            leftClick: spy(),
            rightClick: spy()
        };

        before(() => {
            const { instance: getInstance } = renderShallow(<Nav {...props} />);
            const instance = getInstance();
            instance.rightClick(mockEvent);
            instance.leftClick(mockEvent);
        });

        it('calls the click functions', () => {
            expect(props.leftClick).to.have.been.calledOnce();
            expect(props.rightClick).to.have.been.calledOnce();
        });
    });

});
