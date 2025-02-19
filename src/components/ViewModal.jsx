import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalComponent = ({ show, handleClose, modalData }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="terms-conditions-popup"
      dialogClassName="medium-modal-common"
    >
      <Modal.Body style={{position:'relative'}}>
        <img src="/images/menu-icons/close-popup-icon.svg" alt="Close" style={{position:'absolute', right:'10px', cursor:'pointer'}} onClick={handleClose}/>
        <div className="common-form-wrap">
          <form>
            <div className="common-pop-warp">
              <h3>{modalData?.title}</h3>
              <div className="campaign-termsbox-wrap">
                <div className="campaign-terms-privacy-wp">
                  <p>{modalData?.textContent}</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
