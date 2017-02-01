import React, {Component} from 'react';
import Nav from './nav';
import StaffMember from './staff-member';
import StaffCalendar from './staff-calendar';

export default class StaffPicker extends Component {
	constructor(props) {
		super(props);
	}

	staffClick(props){



		this.props.navigationController.pushView(<StaffCalendar {...props} />);
	}

	render() {
		return (
			<div className="staff-picker">
				<Nav>Choose a Staff Member</Nav>
				<div className="staff">
					<StaffMember onClick={this.staffClick.bind(this)} imagePath="http://i.pravatar.cc/300?img=69" name="James Hunter" />
					<StaffMember onClick={this.staffClick.bind(this)} imagePath="http://i.pravatar.cc/300?img=25" name="Selena Yamada" />
					<StaffMember onClick={this.staffClick.bind(this)} imagePath="http://i.pravatar.cc/300?img=32" name="Sarah Belmoris" />
					<StaffMember onClick={this.staffClick.bind(this)} imagePath="http://i.pravatar.cc/300?img=15" name="Phillip Fry" />
				</div>
			</div>
		);
	}
}