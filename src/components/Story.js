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
			story_info: {
				'desc': '',
				'chapters': 0,
			},
			m: false
		}
	}

	handleModalClose = () => {
		this.setState({
			modalState: false,
			m: false
		});
	}

	handleFetchInfo = (e) => {
		this.setState({modalState: true});
		console.log(e.target.value)
		axios.get(`${API}f?s=${e.target.value}`)
		.then((response) => {
			this.setState({story_info: response.data})
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
	}

	// On each series, dl button fires GET to api about the series, lambda returns info about series in modal
	// Over 700 chapter series throw Interal Server Error 500. See Naruto / One Piece

	render() {
		return (
			<div className='card'>
				<div className='card-body'>
					<img 
						className='card-img-top img-fluid' 
						src={`${this.props.story[1].thumbnail}`} 
						alt={this.props.story[1].title} 
					/>
					<h5 className='card-title'>{this.props.story[1].title}</h5>
				</div>
				<div className='card-footer'>
					<button 
						type='button' 
						className='fetch-info-btn btn btn-primary'
						value={this.props.story[0]} 
						onClick={this.handleFetchInfo}
						onMouseDown={e => e.preventDefault()}
					>
							Fetch Info
					</button>
				</div>
				<StoryModal 
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