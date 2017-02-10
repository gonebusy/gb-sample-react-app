import React, { Component, PropTypes } from 'react';
import Nav from './nav';
import StaffMember from './staff-member';
import StaffCalendar from './staff-calendar';

class StaffPicker extends Component {
    handleStaffClick = () =>
        (props) => {
            this.props.navigationController.pushView(<StaffCalendar {...props} />);
        };

    render() {
        return (
          <div className="staff-picker">
            <Nav>Choose a Staff Member</Nav>
            <div className="staff">
              <StaffMember
                  onStaffClick={this.handleStaffClick()}
                  imagePath="http://i.pravatar.cc/300?img=69"
                  name="James Hunter"
              />
              <StaffMember
                  onStaffClick={this.handleStaffClick()}
                  imagePath="http://i.pravatar.cc/300?img=25"
                  name="Selena Yamada"
              />
              <StaffMember
                  onStaffClick={this.handleStaffClick()}
                  imagePath="http://i.pravatar.cc/300?img=32"
                  name="Sarah Belmoris"
              />
              <StaffMember
                  onStaffClick={this.handleStaffClick()}
                  imagePath="http://i.pravatar.cc/300?img=15"
                  name="Phillip Fry"
              />
            </div>
          </div>
        );
    }
}

StaffPicker.defaultProps = {
    navigationController: Object()
};

StaffPicker.propTypes = {
    navigationController: PropTypes.object
};

export default StaffPicker;
