import React, {Component} from 'react';
import NavigationController from 'react-navigation-controller';
import StaffPicker from './staff-picker';

import '../../scss/main.scss';


export default class App extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount(){
		
	}

	render() {
		return (

			<NavigationController
				views={[<StaffPicker />]}
				preserveState
				transitionTension={10}
				transitionFriction={6} 
			/>
		);
	}
}