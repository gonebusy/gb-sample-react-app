import React, { PropTypes } from 'react';

export const Slot = ({ time, timeClick, index, disabled = false }) => (
  <li className="staff-slots-time" >
    <button onClick={timeClick(time, index)} disabled={disabled}>{time}</button>
  </li>
);

Slot.propTypes = {
    time: PropTypes.string.isRequired,
    timeClick: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired
};

export default Slot;
