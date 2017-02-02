import React, {Component} from 'react';


export default class StaffMember extends Component {
	constructor(props) {
		super(props);
	}


	componentWillMount(){
		
	}

	render() {
		return (
			<div onClick={(props) => this.props.onClick(this.props)} className="staff-member">
				<div className="staff-member__avatar">
					<img className="staff-member__image" src={this.props.imagePath} />
				</div>
				<div className="staff-member__name">{this.props.name}</div>
			</div>
		);
	}
}