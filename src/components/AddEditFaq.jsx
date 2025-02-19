import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const AddEditFaq = ({ show, handleClose, handleAddEdit, initialData }) => {
  const [formData, setFormData] = useState({
    faq_que: '',
    faq_ans: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ faq_que: '', faq_ans: '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddEdit(formData);
    // handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>

      <Modal.Body style={{ position: 'relative'}}>
        <span style={{position:'absolute',cursor:'pointer', right:'10px', top:'10px', backgroundClip:'#2A0181'}}> 
          <img src="/images/menu-icons/close-popup-icon.svg" alt=""  onClick={handleClose}/>
        </span>
        
        <Modal.Title style={{display:'flex', justifyContent:'center', fontWeight:'bolder'}}>{initialData ? 'Edit FAQ' : 'Add FAQ'}</Modal.Title>

        <form onSubmit={handleSubmit}  style={{marginTop:'20px'}}>
          <div className="form-group">
            <input type="text" className="form-control" id="faq_que"
              placeholder="Enter your question there?" value={formData.faq_que}
              onChange={handleChange}  style={{backgroundColor:'#fcf5f6'}}
            />
          </div>
          <div className="form-group" style={{marginTop:'5px'}}>
            <textarea className="form-control" id="faq_ans" rows="6" placeholder="Enter Answer"
              value={formData.faq_ans} onChange={handleChange} style={{backgroundColor:'#fcf5f6'}}></textarea>
          </div>
          <Modal.Footer style={{display:'flex', justifyContent:'center'}}>
            <button type="submit" style={{backgroundColor:"#2A0181", color:'white', padding:'5px 25px', borderRadius:'25px'}}>
              Submit
            </button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditFaq;
