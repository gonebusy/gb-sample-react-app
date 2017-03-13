import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectStaff } from 'src/js/actions/staff';
import Nav from './nav';
import StaffMember from './staff-member';
import StaffCalendar from './staff-calendar';

export const StaffPicker = ({ staffMembers, navigationController, dispatch }) => {
    const handleStaffClick = staffMember => () => {
        dispatch(selectStaff(staffMember));
        navigationController.pushView(<StaffCalendar {...staffMember} />);
    };

    return (
      <div className="staff-picker">
        <Nav>Choose a Staff Member</Nav>
        <div className="staff">
          {
                staffMembers.map((staffMember) => {
                    const { id, imagePath, name } = staffMember;
                    return (
                      <StaffMember
                          key={id}
                          onStaffClick={handleStaffClick(staffMember)}
                          imagePath={imagePath}
                          name={name}
                      />
                    );
                })
            }
        </div>
      </div>
    );
};

StaffPicker.propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigationController: PropTypes.object.isRequired,
    staffMembers: PropTypes.array.isRequired
};

export const mapStateToProps = ({ staff: { staffMembers } }) => ({
    staffMembers
});

export default connect(mapStateToProps)(StaffPicker);
