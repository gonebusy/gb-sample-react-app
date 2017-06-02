import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import StaffMember from './staff-member';

export const StaffPicker = ({ staffMembers, router }) => {
    const handleStaffClick = id => () => {
        router.push(`/staff/${id}`);
    };

    return (
      <div className="staff-picker">
        <div className="staff">
          {
                staffMembers.map((staffMember) => {
                    const { id, imagePath, name } = staffMember;
                    return (
                      <StaffMember
                          key={id}
                          onStaffClick={handleStaffClick(id)}
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
    staffMembers: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired
};

export const mapStateToProps = ({ staff: { staffMembers } }) => ({
    staffMembers
});

export default connect(mapStateToProps)(StaffPicker);
