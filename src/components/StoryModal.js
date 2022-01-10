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
                <Modal.Body>{this.props.chapter_count}</Modal.Body>
            </Modal>
        );
    }
}

export default StoryModal;