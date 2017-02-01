import React, {Component} from 'react';
import Nav from './nav';
import StaffMember from './staff-member';
import StaffForm from './staff-form';
import dateFormat from 'dateformat';

export default class StaffSlots extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			formattedDate: '',
			slots: []
		}
	}

	componentDidMount(){
		this.setState({
			formattedDate: dateFormat(this.props.date, "dddd, d mmm yyyy")
		});

		this.getSlots();
	}


	getSlots(container){
		var number = Math.ceil(Math.random()*5 + 1);
		var time = 7;
		var endings = [':00', ':15', ':30', ':45'];
		var slots = []
		for(var i = 0; i < number; i++){
			time += Math.ceil(Math.random()*3);
			var timeDisplay = time + endings[Math.floor(Math.random()*4)];
			slots.push(timeDisplay);
		}

		this.setState({
			slots: slots
		});
	}


	goBack() {
		this.props.navigationController.popView();
	}

	timeClick(time){
		console.log(time);
		this.props.navigationController.pushView(<StaffForm slot={this.state.formattedDate+' '+time} {...this.props} />);
	}

	renderSlot(time, index){
		var boundItemClick = this.timeClick.bind(this, time)
		return <li onClick={boundItemClick} className="staff-slots-time" key={index}>{time}</li>;
	}

	render() {


		return (
			<div className="staff-slots">
				<Nav leftClick={()=> this.goBack()}>
					<StaffMember imagePath={this.props.imagePath} name={this.props.name} />
				</Nav>
				
				<div className="staff-slots-date">{this.state.formattedDate}</div>

				<ul className="staff-slots-times">
					{this.state.slots.map(this.renderSlot.bind(this))}
				</ul>

			</div>
		);
	}
}