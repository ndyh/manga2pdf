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
			story_info: ''
		}
	}

	handleModalClose = () => {this.setState({modalState: false});}

	handleFetchInfo = (e) => {
		this.setState({modalState: true});
		axios.get(`${API}f?s=${e.target.value}`)
		.then((response) => {
			console.log(e.target.value)
			console.log(response.data)
			this.setState({story_info: response.data})
		});
	}

	// On each series, dl button fires GET to api about the series, lambda returns info about series in modal
	// Over 700 chapter series throw Interal Server Error 500. See Naruto / One Piece

	render() {
		return (
			<div className="card">
				<div className="card-body">
					<img 
						className="card-img-top img-fluid" 
						src={`${this.props.story[1].thumbnail}`} 
						alt={this.props.story[1].title} 
					/>
					<h5 className="card-title">{this.props.story[1].title}</h5>
				</div>
				<div className="card-footer">
					<button 
						type="button" 
						className="fetch-info-btn btn btn-primary"
						value={this.props.story[0]} 
						onClick={this.handleFetchInfo}>
							Fetch Info
					</button>
				</div>
				<StoryModal 
					modalState={this.state.modalState}
					handleModalClose={this.handleModalClose}
					title={this.props.story[1].title}
					info={this.state.story_info}
				/>
			</div>
		);
	}
};

export default Story;