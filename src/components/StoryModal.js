import React from 'react';
import {Modal} from 'react-bootstrap';
import axios from 'axios';
import './StoryModal.css';

import {API} from '../.config';

class StoryModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            c_min: 0,
            c_max: 0,
            in_progress: false,
            c_error: false,
            c_error_message: '',
            complete: false,
            link: ''
        }
    }

    // Create array of span objects containing each genre for a particular story
    buildGenreList = (genre_prop) => {
        let genres_container = [];
        if (genre_prop.length > 6) {
            for(let i = 0; i < 6; i++) {
                genres_container.push(<span className='story-genre' key={genres_container.length}>{genre_prop[i]}</span>)
            };
        } else {genre_prop.forEach(genre => {genres_container.push(<span className='story-genre' key={genres_container.length}>{genre}</span>)});}
        return genres_container;
    }

    // Adjust states of c_min/c_max accordingly on input value change
    handleMinChange = (e) => {this.setState({c_min: e.target.value, complete: false, c_error: false});}
    handleMaxChange = (e) => {this.setState({c_max: e.target.value, complete: false, c_error: false});}

    // Conversion request handling. Calls to AWS Lambda to convert user request. Returns download link to PDF
    handleConversionRequest = async () => {
        // Chapter selection error handling. Min must be less than max. Max must be less or equal to total ch.
        if (this.state.c_min < this.state.c_max && this.state.c_max <= this.props.info.chapters) {
            // Temporary conversion range constraint to prevent larger conversions failures. INCLUSIVE
            if (((this.state.c_max - this.state.c_min)+1) <= 5) {
                try {
                    // Begin PDF conversion request to Lambda
                    this.setState({in_progress: true});
                    const response = await axios.get(
                        `${API}c?s=${this.props.link}&f=${this.state.c_min}&l=${this.state.c_max}`, {
                            Connection: {'keep-alive': {'timeout': 420}}
                        }
                    );
                    // Once conversion complete, adjust state accordingly
                    this.setState({complete: true, link: response.data, in_progress: false});
                } catch (e) {this.setState({c_error: true});} 
            } else {
                // Change error state and message if chapter range is too great
                this.setState({
                    c_error: true,
                    c_error_message: 'Please enter in a chapter range <= 5'
                });
            }
        } else {
            // Change error state and message if selection error occurs
            this.setState({
                c_error: true,
                c_error_message: 'Please check chapter selections'
            });
        }
    }

    render() {
        let modal_body, modal_footer;
        if (this.props.isLoading) {
            modal_body = <div className='story-info-modal-body'>
                <div className='text-center'>
                    <div className='spinner-border text-primary' role='status'>
                        <span className='visually-hidden'>Loading</span>
                    </div>
                </div>
            </div>
        } else {
            let button;
            let chapter_selection = (<div className='chapter-selection-container container'>
                <h6>Chapters: {this.props.info.chapters}</h6>
                <div className='input-group input-group-sm'>
                    <span className='input-group-text' id='inputGroup-sizing-sm'>First</span>
                    <input 
                        className='form-control'
                        type='number' id='min' name='min' 
                        min={1} max={this.state.c_max}
                        onChange={this.handleMinChange} 
                        placeholder={1}
                    />
                </div>
                <div className='input-group input-group-sm'>
                    <span className='input-group-text' id='inputGroup-sizing-sm'>Last</span>
                    <input 
                        className='form-control' 
                        type='number' id='max' name='max' 
                        min={this.state.c_min} max={this.props.info.chapters}
                        onChange={this.handleMaxChange} 
                        placeholder={this.props.info.chapters}
                    />
                </div>
            </div>);
            if (this.state.complete) {
                button = <button type='button' className='download-btn btn btn-success' 
                    onClick={() => {window.open(this.state.link, '_blank');}}>
                    Download
                </button>
            } else if (this.state.c_error) {
                button = <button type='button' className='convert-btn btn btn-danger' disabled>
                    Error!
                </button>
            } else if (this.state.in_progress) {
                chapter_selection = (<div className='chapter-selection-container container'>
                    <h6>Chapters: {this.props.info.chapters}</h6>
                    <div className='input-group input-group-sm'>
                        <span className='input-group-text' id='inputGroup-sizing-sm'>First</span>
                        <input 
                            className='form-control'
                            type='number' id='min' name='min' 
                            min={1} max={this.state.c_max}
                            onChange={this.handleMinChange} 
                            placeholder={1} disabled
                        />
                    </div>
                    <div className='input-group input-group-sm'>
                        <span className='input-group-text' id='inputGroup-sizing-sm'>Last</span>
                        <input 
                            className='form-control' 
                            type='number' id='max' name='max' 
                            min={this.state.c_min} max={this.props.info.chapters}
                            onChange={this.handleMaxChange} 
                            placeholder={this.props.info.chapters} disabled
                        />
                    </div>
                </div>);
                button = <button type='button' className='convert-btn btn btn-primary' disabled>
                    <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
                    <span className='visually-hidden'>Converting</span>
                </button>
            } else { 
                button = <button type='button' className='convert-btn btn btn-primary' 
                    onClick={this.handleConversionRequest}>
                    Convert
                </button>    
            }
            modal_body = (<Modal.Body className='story-info-modal-body'>
                <div className='story-genre-container container'>
                    <h6 className='story-genre-header'>Genres</h6>
                    <div className='story-genre-list'>
                        {this.buildGenreList(this.props.info.genres)}
                    </div>
                </div>
                <hr/>
                <div className='description-container'>
                    <h6 className='description-header'>Description</h6>
                    {<p className='description'>
                        {this.props.info.desc}
                        {this.props.m && <a href={this.props.link}
                            target='_blank'
                            rel='noreferrer'>
                            <i>more on Manganato</i>
                        </a>}
                    </p>}
                </div>
            </Modal.Body>);
            modal_footer = (<Modal.Footer className='story-info-modal-footer'>
                {chapter_selection}
                {button}
            </Modal.Footer>);
        }

        return (
            <Modal className='story-info-modal' show={this.props.modalState} onHide={this.props.handleModalClose} 
                aria-labelledby='contained-modal-title-vcenter' centered>
                <Modal.Header className='story-info-modal-header' closeButton closeVariant='white'>
                    <img 
						className='story-info-modal-img img-fluid' 
						src={`${this.props.img}`} 
						alt={this.props.title} 
					/>
                    <Modal.Title className='story-info-modal-title'>{this.props.title}</Modal.Title>
                </Modal.Header>
                {modal_body}
                {modal_footer}
            </Modal>
        );
    }
}

export default StoryModal;