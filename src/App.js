import React from 'react';
import axios from 'axios';

import Story from './components/Story';

const API = ''

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			keyword: '',
			story_list: [],
			isSubmitted: false
		}
	}

	handleChange = e => {
		this.setState({ keyword: e.target.value }); // Set keyword state to search bar text value
	}

	handleSubmit = e => {
		e.preventDefault(); // Prevent form from default submission

		// Take user keyword from search bar, make request to aws api to execute lambda function
		// Return relevant data, set boolean to true to render list of data
		axios.get(`${API}search?q=${this.state.keyword.replace(/ /g, '_')}`)
		.then((response) => {
			this.setState({
				story_list: Object.entries(response.data),
				isSubmitted: true
			});
			console.log(this.state.story_list);
		});
	}

	render() {
		return (
		<div className="App">
			<h1>Manga2PDF</h1>
			<div className="search-form">
			<form onSubmit={ this.handleSubmit }>
				<input 
					type="text"
					placeholder="Search for a series"
					value={ this.state.keyword }
					onChange={ this.handleChange }
				/>
				<input type="submit" name="Search" value="Search" />
			</form>
			</div>
			{this.state.isSubmitted &&
			<div className="story-list card-deck">
				{this.state.story_list.map((s) => (
					<Story 
						title={ s[1].title }
						link={ s[0] }
						thumbnail={ s[1].thumbnail }
						chapters={ s[1].chapters }
					/>
				))}
			</div>
			}
		</div>
		)
	}
}

export default App;