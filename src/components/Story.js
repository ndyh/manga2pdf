import React from 'react';
import axios from 'axios';
import './Story.css';
import StoryModal from './StoryModal';

import {API} from '../.config';

class Story extends React.Component {
	constructor(props) {
		super(props); 
		this.state = {
			modalState: false,
			story_info: 0
		}
	}

	handleModalClose = () => {this.setState({modalState: false});}

	handleFetchInfo = (e) => {
		this.setState({modalState: true});
		axios.get(`${API}f?s=${e.target.value}`)
		.then((response) => {
			console.log(e.target.value)
			this.setState({story_info: response.data})
		});
	}

	// On each series, dl button fires GET to api about the series, lambda returns info about series in modal

	render() {
		return (
			<div className="card">
				{/* <img className="card-img-top" src={`${ this.props.thumbnail }`} alt={ this.props.title } /> */}
				<div className="card-body">
					<h5 className="card-title">{this.props.story[1].title}</h5>
				</div>
				<div className="card-footer">
					<button 
						type="button" 
						className="btn btn-primary"
						value={this.props.story[0]} 
						onClick={this.handleFetchInfo}>
							Fetch Info
					</button>
				</div>
				<StoryModal 
					modalState={this.state.modalState}
					handleModalClose={this.handleModalClose}
					title={this.props.story[1].title}
					chapter_count={this.state.story_info}
				/>
			</div>
		);
	}
};

export default Story;