import React, { Component } from 'react';


export default class Nav extends Component {

	constructor(props) {
		super(props);
	}

	leftClick(e){
		this.props.leftClick();
		e.preventDefault();
	}

	rightClick(e){
		this.props.rightClick();
		e.preventDefault();
	}

	renderLeftLink(){
		if(this.props.leftClick){
			return (
				<a className="nav-header--prev" href="#" onClick={(e)=> this.leftClick(e)}></a>
			)
		}
	}

	renderRightLink(){
		if(this.props.rightClick){
			return (
				<a className="nav-header--next" href="#" onClick={(e)=> this.rightClick(e)}></a>
			)
		}
	}


	render(){
		return (
			<div className="nav-header">
				<div className="nav-header--link">{this.renderLeftLink()}</div>
				<div className="nav-header--title">{this.props.children}</div>
				<div className="nav-header--link">{this.renderRightLink()}</div>
			</div>
		)
	}
}				