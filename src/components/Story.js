import React from 'react';

import StoryModal from './StoryModal';

class Story extends React.Component {
	constructor(props) {
		super(props); 
		this.state = {
			isClicked: false
		}
	}

	handleClick = e => {
		this.setState({ isClicked: true }) // Change state boolean to true to trigger modal loading
	}

	render() {
		return (
			<div className="card">
				<img className="card-img-top" src={`${ this.props.thumbnail }`} alt={ this.props.title } />
				<div className="card-body">
					<h5 className="card-title">{ this.props.title }</h5>
				</div>
				<div className="card-footer">
					<button type="button" onClick={ this.handleClick } className="btn btn-primary">Download</button>
					{this.state.isClicked &&
						<StoryModal /> // Render story modal component on click
					}
				</div>
			</div>
	)}
};

export default Story;