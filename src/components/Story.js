import React from 'react';

class Story extends React.Component {
	render() {
		return (
			<div className="card">
				<img className="card-img-top" src={`${this.props.thumbnail}`} alt={this.props.title} />
				<div className="card-body">
					<h5 className="card-title">{this.props.title}</h5>
				</div>
				<div className="card-footer">
					<button>Test button</button>
				</div>
			</div>
	)}
};

export default Story;