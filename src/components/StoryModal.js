import React from 'react';
import { Modal } from 'react-bootstrap';

class StoryModal extends React.Component {
    render() {
        return (
            // Vanilla bootstrap modal for testing purposes
            <Modal show={ this.props.showModal } onHide={ this.props.handleModal }>
                <Modal.Header closeButton>
                    <Modal.Title>Heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Body</Modal.Body>
            </Modal>
        );
    }
}

export default StoryModal;