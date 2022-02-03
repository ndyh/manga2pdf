import React from 'react';
import axios from 'axios';
import './Story.css';
import StoryModal from './StoryModal';

import {API} from '../.config';

class Story extends React.Component {
	constructor(props) {
		super(props); 
		this.state = {
			isLoading: false,
			modalState: false,
			story_info: {
				'genres': [],
				'desc': '',
				'chapters': 0,
			},
			m: false
		}
	}

	// Handles closing of modal to prevent modal from being unable to open
	handleModalClose = () => {this.setState({modalState: false, m: false});}

	// Handles fetch info request. Calls to AWS Lambda to get info required to make a conversion request. On modal opening
	handleFetchInfo = async (e) => {
		// Adjust modal state to opened and begin loading (render spinner)
		this.setState({modalState: true, isLoading: true});
		await axios.get(`${API}f?s=${e.target.value}`).then((response) => {
			// Set info state to response
			this.setState({story_info: response.data})
			// Adjust description length if too long. Makes modal easier on the eyes
			if (this.state.story_info.desc.length > 190) {
				this.setState(prevState => ({
					story_info: {
						...prevState.story_info,
						desc: `${this.state.story_info.desc.substring(0, 190)}… `,
					},
					m: true
				}));
			}
		});
		// After API response, adjust loading state to false (render story_info)
		this.setState({isLoading: false});
	}

	render() {
		return (
			<div className='card'>
				<div className='card-body'>
					<img className='card-img-top img-fluid' 
						src={`${this.props.story[1].thumbnail}`} 
						alt={this.props.story[1].title} 
					/>
					<h5 className='card-title'>{this.props.story[1].title}</h5>
				</div>
				<div className='card-footer'>
					<button type='button' className='fetch-info-btn btn btn-primary'
						value={this.props.story[0]} onClick={this.handleFetchInfo}
						onMouseDown={e => e.preventDefault()}>
						Fetch Info
					</button>
				</div>
				<StoryModal 
					isLoading={this.state.isLoading}
					modalState={this.state.modalState}
					handleModalClose={this.handleModalClose}
					title={this.props.story[1].title}
					info={this.state.story_info}
					link={this.props.story[0]}
					img={this.props.story[1].thumbnail}
					m = {this.state.m}
				/>
			</div>
		);
	}
};

export default Story;