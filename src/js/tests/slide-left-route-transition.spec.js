import { expect } from 'chai';
import React from 'react';
import renderShallow from 'render-shallow';
import { RouteTransition } from 'react-router-transition';
import { slideLeft } from 'src/js/utils/transition-fixtures';
import LeftSlide from '../components/slide-left-route-transition';

describe('<LeftSlide>', () => {
    context('when component renders', () => {
        let component;
        const children = undefined;
        const location = {
            pathname: 'some-path'
        };
        before(() => {
            component = renderShallow(<LeftSlide location={location} />).output;
        });

        it('renders <LeftSlide>', () => {
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

});
