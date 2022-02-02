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
            c_error_message: '',
            complete: false,
            link: ''
        }
    }

    buildGenreList = (genre_prop) => {
        let genres_container = [];
        genre_prop.forEach(genre => {genres_container.push(<span className='story-genre'>{genre}</span>)});
        return genres_container;
    }

    handleMinChange = (e) => {this.setState({c_min: e.target.value});}

    handleMaxChange = (e) => {this.setState({c_max: e.target.value});}

    handleConversionRequest = async () => {
        if (this.state.c_min < this.state.c_max && this.state.c_max <= this.props.info.chapters) {
            if ((this.state.c_max - this.state.c_min) < 5) {
                try {
                    this.setState({in_progress: true});
                    const response = await axios.get(
                        `${API}c?s=${this.props.link}&f=${this.state.c_min}&l=${this.state.c_max}`, {
                            Connection: {'keep-alive': {'timeout': 420}}
                        }
                    );
                    this.setState({complete: true, link: response.data, in_progress: false});
                } catch (e) {this.setState({c_error: true});} 
            } else {
                this.setState({
                    c_error: true,
                    c_error_message: 'Please enter in a chapter range that\'s < 5'
                });
            }
        } else {
            this.setState({
                c_error: true,
                c_error_message: 'Please check chapter selections'
            });
        }
    }

    render() {
        let modal_body, modal_footer;
        if (this.props.isLoading) {
            modal_body = <div className='is-loading'><div className='lds-spinner'><div></div><div></div><div></div><div></div><div>
                </div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
        } else {
            let button
            if (this.state.complete) {
                button = <button 
                    type='button' 
                    className='download-btn btn btn-success' 
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
                    className='convert-btn btn btn-primary' 
                    disabled
                >Converting</button>
            } else { 
                button = <button 
                    type='button' 
                    className='convert-btn btn btn-primary' 
                    onClick={this.handleConversionRequest}
                >Convert</button>    
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
            </Modal.Body>)

            modal_footer = (<Modal.Footer className='story-info-modal-footer'>
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
            </Modal.Footer>)
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
                {modal_body}
                {modal_footer}
            </Modal>
        );
    }
}

export default StoryModal;