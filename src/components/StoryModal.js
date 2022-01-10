import React from 'react';
import {Modal} from 'react-bootstrap';

class StoryModal extends React.Component {
    // Return info here about story
    render() {
        return (
            // Vanilla bootstrap modal for testing purposes
            <Modal 
                show={this.props.modalState}
                onHide={this.props.handleModalClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='desc'>{this.props.info.desc}</div>
                    <div className='cc'>Chapters: {this.props.info.chapters}</div>
                </Modal.Body>
            </Modal>
        );
    }
}

export default StoryModal;