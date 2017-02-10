import dateFormat from 'dateformat';
import React, { Component, PropTypes } from 'react';
import Nav from './nav';
import StaffMember from './staff-member';
import StaffForm from './staff-form';

class StaffSlots extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formattedDate: dateFormat(props.date, 'dddd, d mmm yyyy'),
            slots: []
        };
    }

    componentDidMount() {
        this.getSlots();
    }

    getSlots = () => {
        const number = Math.ceil((Math.random() * 5) + 1);
        const endings = [':00', ':15', ':30', ':45'];
        const slots = [];
        let time = 7;
        for (let i = 0; i < number; i += 1) {
            time += Math.ceil(Math.random() * 3);
            const timeDisplay = time + endings[Math.floor(Math.random() * 4)];
            slots.push(timeDisplay);
        }

        this.setState({ slots });
    }

    goBack = () => {
        this.props.navigationController.popView();
    }

    timeClick = time => () => {
        console.log(time);
        this.props.navigationController
            .pushView(<StaffForm slot={`${this.state.formattedDate} ${time}`} {...this.props} />);
    }

    renderSlot = (time, index) =>
        (
          <li className="staff-slots-time" key={index}>
            <button onClick={this.timeClick(time)}>{time}</button>
          </li>
        );

    render() {
        return (
          <div className="staff-slots">
            <Nav leftClick={() => this.goBack()}>
              <StaffMember imagePath={this.props.imagePath} name={this.props.name} />
            </Nav>

            <div className="staff-slots-date">{this.state.formattedDate}</div>

            <ul className="staff-slots-times">
              {this.state.slots.map(this.renderSlot)}
            </ul>
          </div>
        );
    }
}

StaffSlots.propTypes = {
    date: PropTypes.object.isRequired,
    imagePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    navigationController: PropTypes.object.isRequired
};

export default StaffSlots;
