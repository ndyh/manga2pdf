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
            c_error: '',
            complete: false,
            link: ''
        }
    }

    handleMinChange = (e) => {this.setState({c_min: e.target.value});}

    handleMaxChange = (e) => {this.setState({c_max: e.target.value});}

    handleConversionRequest = async () => {
        if (this.state.c_min < this.state.c_max && this.state.c_max <= this.props.info.chapters) {
            try {
                this.setState({in_progress: true});
                const response = await axios.get(
                    `${API}c?s=${this.props.link}&f=${this.state.c_min}&l=${this.state.c_max}`, {
                        timeout: 420000
                    }
                );
                this.setState({complete: true, link: response.data, in_progress: false});
            } catch (e) {this.setState({c_error: true});} 
        } else {this.setState({c_error: true});}
    }

    render() {
        let button;
        if (this.state.complete) {
            button = <button 
                type='button' 
                className='download-btn btn btn-primary' 
                onClick={(e) => {window.open(this.state.link, '_blank');
            }}>Download</button>
        } else if (this.state.c_error) {
            button = <button 
                type='button' 
                className='convert-btn btn btn-danger' 
                disabled
            >Error!</button>
        } else if (this.state.in_progress) {
            button = <button 
                type='button' 
                className='convert-btn btn btn-success' 
                disabled
            >Converting</button>
        } else { 
            button = <button 
                type='button' 
                className='convert-btn btn btn-success' 
                onClick={this.handleConversionRequest}
            >Convert</button>    
        }

        return (
            <Modal
                className='story-info-modal'
                show={this.props.modalState}
                onHide={this.props.handleModalClose}
                aria-labelledby='contained-modal-title-vcenter'
                centered
            >
                <Modal.Header className='story-info-modal-header' closeButton closeVariant='white'>
                    <img 
						className='story-info-modal-img img-fluid' 
						src={`${this.props.img}`} 
						alt={this.props.title} 
					/>
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
                        {/* TODO: Import list of genres from manganato */}
                    </div>
                </Modal.Body>
                <Modal.Footer className='story-info-modal-footer'>
                    <div className='chapter-selection-container container'>
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
                    </div>
                    {button}
                </Modal.Footer>
            </Modal>
        );
    }
}

export default StoryModal;