import React, { Component, PropTypes } from 'react';

class StaffMember extends Component {
    handleClick = props => () =>
        this.props.onStaffClick(props);

    render() {
        return (
          <div onClick={this.handleClick(this.props)} className="staff-member">
            <div className="staff-member__avatar">
              <img
                  className="staff-member__image"
                  src={this.props.imagePath}
                  alt={this.props.name}
              />
            </div>
            <div className="staff-member__name">{this.props.name}</div>
          </div>
        );
    }
}

StaffMember.defaultProps = {
    onStaffClick: StaffMember.prototype.handleClick
};

StaffMember.propTypes = {
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onStaffClick: PropTypes.func
};

export default StaffMember;
