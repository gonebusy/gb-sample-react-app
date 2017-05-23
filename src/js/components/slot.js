import React, { PropTypes } from 'react';

export const Slot = ({ time, timeClick, index }) => (
  <li className="staff-slots-time" >
    <button onClick={timeClick(time, index)}>{time}</button>
  </li>
);

Slot.propTypes = {
    time: PropTypes.string.isRequired,
    timeClick: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
};

export default Slot;
