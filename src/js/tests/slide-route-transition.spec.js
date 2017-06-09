import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { RouteTransition } from 'react-router-transition';
import { slideLeft, slideRight } from 'src/js/utils/transition-fixtures';
import { POP, PUSH } from 'src/js/constants';
import Slide from '../components/slide-route-transition';

describe('<Slide>', () => {
    context(`when component renders with ${PUSH} action`, () => {
        let component;
        const children = undefined;
        const location = {
            pathname: 'some-path',
            action: PUSH
        };
        before(() => {
            component = renderShallow(<Slide location={location} />).output;
        });

        it('renders <Slide> with slideLeft configuration', () => {
            expect(component).to.eql(
              <RouteTransition
                  component={false}
                  className="transition-wrapper"
                  pathname={location.pathname}
                  {...slideLeft}
              >
                {children}
              </RouteTransition>
            );
        });

    });
    context(`when component renders with ${POP} action`, () => {
        let component;
        const children = undefined;
        const location = {
            pathname: 'some-path',
            action: POP
        };
        before(() => {
            component = renderShallow(<Slide location={location} />).output;
        });

        it('renders <Slide> with slideRight configuration', () => {
            expect(component).to.eql(
              <RouteTransition
                  component={false}
                  className="transition-wrapper"
                  pathname={location.pathname}
                  {...slideRight}
              >
                {children}
              </RouteTransition>
            );
        });

    });

});
