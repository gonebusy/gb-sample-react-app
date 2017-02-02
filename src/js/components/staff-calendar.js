import React, {Component} from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import Nav from './nav';
import StaffMember from './staff-member';
import StaffSlots from './staff-slots';


export default class Calendar extends Component {
	constructor(props) {
		super(props);
	}

	dayClick(e, day) {
		this.props.navigationController.pushView(<StaffSlots date={day} {...this.props} />);
	}

	goBack() {
		this.props.navigationController.popView();
	}

	render() {
		return (
			<div className="staff-calendar">
				<Nav leftClick={()=> this.goBack()}>
					<StaffMember imagePath={this.props.imagePath} name={this.props.name} />
				</Nav>
			
				<div className="staff-calendar-picker">
					<DayPicker
						onDayClick={ this.dayClick.bind(this) }
						weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
					/>
				</div>
			</div>
		);
	}
}