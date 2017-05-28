import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { spy } from 'sinon';
import { findWithClass } from 'react-shallow-testutils';
import { initialState } from 'src/js/reducers/staff';
import { createNew } from 'src/js/store';
import noop from '../../../lib/util/noop';
import NavConnected, { Nav } from '../components/nav';
import StaffMember from '../components/staff-member';

describe('<Nav>', () => {
    context('when rendered without staff member and link props', () => {
        let component;
        const props = {
            imagePath: '',
            name: '',
            router: { location: { pathname: '/' } }
        };
        before(() => {
            component = renderShallow(
              <Nav {...props} />).output;
        });

        it('renders without left and right navigation', () => {
            expect(component).to.eql(
              <div>
                <div className="nav-header">
                  <div className="nav-header--link" />
                  <div className="nav-header--title">
                    <p>Choose a staff member</p>
                  </div>
                  <div className="nav-header--link" />
                </div>
              </div>
            );
        });
    });

    context('when rendered with navigation props', () => {
        let component;
        const props = {
            imagePath: 'some/path',
            name: 'Steve Smith',
            router: { goBack: noop, location: { pathname: 'some/path' } }
        };

        before(() => {
            component = renderShallow(
              <Nav {...props} />).output;
        });

        it('renders with left and right navigation links', () => {
            expect(component).to.eql(
              <div>
                <div className="nav-header">
                  <div className="nav-header--link">
                    <a className="nav-header--prev" onClick={() => props.router.goBack()} />
                  </div>
                  <div className="nav-header--title">
                    <StaffMember imagePath={props.imagePath} name={props.name} />
                  </div>
                  <div className="nav-header--link" />
                </div>
              </div>
            );
        });
    });

    context('when navigation links are clicked', () => {
        const props = {
            imagePath: 'some/path',
            name: 'Steve Smith',
            router: { goBack: spy(), location: { pathname: 'some/path' } }
        };

        before(() => {
            const component = renderShallow(<Nav {...props} />).output;
            const previousLink = findWithClass(component, 'nav-header--prev');
            previousLink.props.onClick();
        });

        it('calls the click functions', () => {
            expect(props.router.goBack).to.have.been.calledOnce();
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

        before(() => {
            store = createNew({ staff: { ...initialState, selectedStaffMember } });
            component = renderShallow(
              <NavConnected
                  store={store}
                  router={{ }}
              />
            ).output;
        });
        it('renders Nav with staff information', () => {
            expect(component).to.eql(
              <Nav
                  dispatch={noop}
                  imagePath={selectedStaffMember.imagePath}
                  name={selectedStaffMember.name}
                  store={store}
                  router={{ }}
              />
            );
        });
    });
});
