import React from 'react';
import axios from 'axios';
import './App.css';
import Story from './components/Story';

import {API} from './.config';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			show_notice: true,
			expand_notice: false,
			keyword: '',
			story_list: [],
			isSubmitted: false
		}
	}

	// Temp code for collapsible notice
	handleHideNotice = () => {this.setState({show_notice: false});}
	handleCollapsiable = () => {
		if (this.state.expand_notice) {this.setState({expand_notice: false});} 
		else {this.setState({expand_notice: true});}
	}

	// Set keyword state to search bar text value
	handleChange = (e) => {this.setState({ keyword: e.target.value });} 

	// Handle request to fetch relevant series to keyword
	handleSubmit = (e) => {
		// Prevent form from default submission
		e.preventDefault();
		// Take user keyword from search bar, make request to aws api to execute lambda function
		// Return relevant data, adjust submission state (render story_list)
		axios.get(`${API}s?q=${this.state.keyword.replace(/ /g, '_')}`).then((response) => {
			this.setState({
				story_list: Object.entries(response.data),
				isSubmitted: true,
			});
		});
	}

	render() {
		return (
			<div className='App'>
				{this.state.show_notice && <div className='notice-container'>
					<button className='notice btn btn-primary' type='button' onClick={this.handleCollapsiable}>
					<svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' fill='currentColor' className='notice-icon bi bi-exclamation-triangle-fill flex-shrink-0 me-2' viewBox='0 0 16 16' role='img' aria-label='Warning:'>
							<path d='M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/>
						</svg>
						Developer Notice<span type='button' className='notice-btn-close btn-close btn-close-white' aria-label='Close' onClick={this.handleHideNotice}></span>
						{/* <span>close button goes here</span> */}
					</button>
					{this.state.expand_notice && <div className='notice-content'>
						<p className='notice-body alert alert-primary'>
							<code>Notice: </code>This application is still under development.<br/>
							<code>Reason: </code>Given the current state of the application, there may be instances where conversion requests fail.
							While these errors continue to exist, there will be a limit to how many chapters may be converted within a single request of 5 or less.<br/>
							<code>Note: </code>Please visit the <a href='https://github.com/ndyh/Manga2PDF#readme' target='_blank' rel='noreferrer'>GitHub</a> for further information.
						</p>
					</div>}
				</div>}
				<div className='app-header'>
					<h1><a  className='title' href='/'>Manga2PDF</a></h1>
						<form onSubmit={this.handleSubmit}>
							<div className='input-group'>
								<input 
									className='form-control'
									type='text'
									placeholder='Search for a series'
									value={this.state.keyword}
									onChange={this.handleChange}
								/>
								<div className='input-group-append'>
									<button 
										className='btn btn-primary'
										type='submit' 
										name='Search' 
										value='Search' 
									>
										Search
									</button>
								</div>
							</div>
						</form>
				</div>
				<div className='app-body'>
					{this.state.isSubmitted &&
					<div className='story-list card-deck'>
						{Array(Math.ceil(this.state.story_list.length / 3)).fill().map((_, ri) => (
							<div className='row' key={ri}>
								{this.state.story_list.slice(ri * 3, (ri * 3) + 3).map(story => (
									<div className='col-6 col-md-4' key={this.state.story_list.indexOf(story)}>
										<Story story={story}/>
									</div>
								))}
							</div>
						))}
					</div>
					}
				</div>
			</div>
		);
	}
}

export default App;