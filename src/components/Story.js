import React from 'react';
import './Story.css';
import StoryModal from './StoryModal';

class Story extends React.Component {
	constructor(props) {
		super(props); 
		this.state = {
			modalState: false
		}
	}

	handleModalShow = () => {this.setState({modalState: true});}
	handleModalClose = () => {this.setState({modalState: false});}

	// On each series, dl button fires GET to api about the series, lambda returns info about series in modal

	render() {
		return (
			<div className="card">
				{/* <img className="card-img-top" src={`${ this.props.thumbnail }`} alt={ this.props.title } /> */}
				<div className="card-body">
					<h5 className="card-title">{this.props.title}</h5>
				</div>
				<div className="card-footer">
					<button 
						type="button" 
						className="btn btn-primary" 
						onClick={this.handleModalShow}>
							Fetch Info
					</button>
				</div>
				<StoryModal 
					modalState={this.state.modalState}
					handleModalClose={this.handleModalClose}
					title={this.props.title}
				/>
			</div>
		);
	}
};

export default Story;