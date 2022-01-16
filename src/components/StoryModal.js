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
            c_response: ''
        }
    }

    handleMinChange = (e) => {this.setState({c_min: e.target.value});}

    handleMaxChange = (e) => {this.setState({c_max: e.target.value});}

    handleConversionRequest = () => {
        if (this.state.c_min < this.state.c_max && this.state.c_max <= this.props.info.chapters) {
            this.setState({c_response: 'Converting'})
            axios.get(`${API}c?s=${this.props.link}&f=${this.state.c_min}&l=${this.state.c_max}`)
            .then((response) => {
                this.setState({c_response: response.data});
                // window.open(this.state.c_response)
            });
        } else {
            this.setState({c_response: 'input error'})
        }
    }

    // Return info here about story
    render() {
        return (
            // Vanilla bootstrap modal for testing purposes
            <Modal
                className='story-info-modal'
                show={this.props.modalState}
                onHide={this.props.handleModalClose}
                aria-labelledby='contained-modal-title-vcenter'
                centered
            >
                <Modal.Header className='story-info-modal-header' closeButton>
                    <Modal.Title className='story-info-modal-title'>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='story-info-modal-body'>
                    <div className='description-container'>
                        <h6>Description</h6>{
                        <p className='description'>
                            {this.props.info.desc}
                            {this.props.m && 
                                <a href={this.props.link}
                                    target='_blank'
                                    rel='noreferrer'>
                                    <i>more on Manganato</i>
                                </a>
                            }
                        </p>
                    }</div>
                    <div className='story-genre-container container'>
                        {/* Import list of genres from manganato */}
                    </div>
                </Modal.Body>
                <Modal.Footer className='story-info-modal-footer'>
                    <div className='chapter-selection-container'>
                        <h6>Chapters: {this.props.info.chapters}</h6>
                        <input 
                            type='number' id='min' name='min' 
                            min={1} max={this.state.c_max}
                            onChange={this.handleMinChange}
                        />
                        <input 
                            type='number' id='max' name='max' 
                            min={this.state.c_min} max={this.props.info.chapters}
                            onChange={this.handleMaxChange} 
                        />
                    </div>
                    <button 
                        type='button' 
                        className='convert-btn btn btn-success'
                        onClick={this.handleConversionRequest}
                    >
                        Convert
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default StoryModal;