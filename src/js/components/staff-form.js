import React, {Component} from 'react';
import Nav from './nav';
import StaffMember from './staff-member';


export default class StaffForm extends Component {
	constructor(props) {
		super(props);
	}


	goBack() {
		this.props.navigationController.popView();
	}


	render() {
		return (
			<div className="staff-form">
				<Nav leftClick={()=> this.goBack()}>
					<StaffMember imagePath={this.props.imagePath} name={this.props.name} />
				</Nav>

				<div className="staff-slots-date">{this.props.slot}</div>

				<div className="staff-form__form">
					<div className="staff-form__form-group">
						<label>Name</label>
						<input type="text" name="name" required="required" />
					</div>
					<div className="staff-form__form-group">
						<label>Email</label>
						<input type="email" name="email" required="required" />
					</div>
					<button className="staff-form__confirm-btn">Confirm Booking</button>
				</div>

			</div>
		);
	}
}

