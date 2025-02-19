import React from 'react';
import { Modal } from 'react-bootstrap';

function DeletePopup({ show, handleClose, handleDelete, modalData }) {
  return (
    <Modal className='delete-popup' show={show} onHide={handleClose}>
      <Modal.Body>
        <img
          src="/images/menu-icons/close-popup-icon.svg"
          alt="Close"
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            right: '15px',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
          }}
        />
        <div className="logout-pop-wrap text-center">
          <div className="logout-img-wrap mb-3">
            <img src="/images/menu-icons/delete-popup-icon.svg" alt="Delete" />
          </div>
          <p style={{fontWeight:"bold"}}>Are you sure you want to delete?</p>
          <div className="all-commonbtns-popup mt-3">
          <div className="all-commonbtns-popup">
            <a href="#" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}>Cancel</a>
            <a href="#" data-bs-dismiss="modal" aria-label="Close" onClick={handleDelete}>Delete</a>
          </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeletePopup;
