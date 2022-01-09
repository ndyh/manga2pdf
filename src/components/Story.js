import React from 'react';

import StoryModal from './StoryModal';

class Story extends React.Component {
	constructor(props) {
		super(props); 
		this.state = {
			showModal: false
		}
	}
	
	handleModal = e => {
		if (this.state.showModal) {
			this.setState({ showModal: false });
		} else { this.setState({ showModal: true }); } 
	}

	render() {
		return (
			<div className="card">
				{/* <img className="card-img-top" src={`${ this.props.thumbnail }`} alt={ this.props.title } /> */}
				<div className="card-body">
					<h5 className="card-title">{ this.props.title }</h5>
				</div>
				<div className="card-footer">
					<button type="button" onClick={ this.handleModal } className="btn btn-primary">Download</button>
				{ this.state.showModal &&
					<StoryModal 
						showModal={ this.state.showModal }
						handleModal={ this.handleModal }
					/>
				}	
				</div>
			</div>
		);
	}
};

export default Story;