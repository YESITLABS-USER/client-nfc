import React, { useEffect, useState } from "react";
import contactData from "../assets/contact.json";
import Pagination from "../components/Pagination";
import DeletePopup from "../components/DeletePopup";
import AddEditFaq from "../components/AddEditFaq";
import { useDispatch, useSelector } from "react-redux";
import { createFaq, deleteContact, deleteFaq, editFaq, getAllContacts, getAllFaq, updateFeedback } from "../redux/slices/faqSlice";
import { Modal } from "react-bootstrap";
import HideShow from "../components/HideShow";
import CsvDownloader from "react-csv-downloader";

const ContactFaq = () => {
  const [show, setShow] = useState(false);
  const [currentModalData, setCurrentModalData] = useState(null);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteModalData, setdeleteModalData] = useState(null);
  
  const dispatch = useDispatch();
  const { allFaq, allContacts ,contactLoading , contactError , loading , error } = useSelector((state) => state.faqs)
  
  const [currentData, setCurrentData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [faqShow, setFaqShow] = useState(false);
  const [faqModalData, setFaqModalData] = useState(null);
  const [filterFaqData, setFilterFaqData] = useState([]);
  const [currentFAQData, setCurrentFAQData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  // const [activeTab, setActiveTab] = useState('section-1'); // Default to 'Contact Us' tab
    const [activeTab, setActiveTab] = useState(() => {
      const savedTab = localStorage.getItem('activeTab');
      return savedTab == 'section-1' || savedTab == 'section-2' ? savedTab : 'section-1';
    });

  const handleTabClick = (id) => {
    setActiveTab(id);
    localStorage.setItem('activeTab', id); // Store the active tab in localStorage
  };

  useEffect(() => {
    dispatch(getAllFaq());
    dispatch(getAllContacts());
  },[dispatch])

  useEffect(() => {
    if(allFaq){
      setFilterFaqData(allFaq);
    }
  },[allFaq])

  useEffect(() => {
    if(allContacts){
      setFilterData(allContacts);
    }
  },[allContacts])

  const handleOpenModal = (faq = null) => {
    setSelectedFaq(faq);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFaq(null);
  };

  const handleAddEditFaq = async (faq) => {
    try {
      if (!faq.id) {
        await dispatch(createFaq(faq))
      } else {
        await dispatch(editFaq(faq))
      }
      handleCloseModal(); 
    } catch (error) {
      console.error("Error occurred:", error)
    }
  }
  
    // for Faq Delete modal 
    const handleFaqDeleteShow = (modalData) => {
      setFaqModalData(modalData);
      setFaqShow(true);
    };
    const handleFaqDeleteClose = () => {
      setFaqShow(false);
      setFaqModalData(null);
    }
  
    const handleFaqDelete = () => {
      if (faqModalData) {
        dispatch(deleteFaq({id:faqModalData}));
        // setCurrentFAQData((prevData) => prevData.filter((item) => item.id !== faqModalData));
      }
      handleFaqDeleteClose(); 
    };

  // for Feedback show modal 
  const handleShow = (modalData) => {
    setCurrentModalData(modalData);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  // for Contact us Delete modal 
  const handleDeleteShow = (modalData) => {
    setdeleteModalData(modalData);
    setDeleteShow(true);
  };
  const handleDeleteClose = () => {
    setDeleteShow(false);
    setdeleteModalData(null);
  }

  const handleDelete = () => {
    if (deleteModalData) {
      dispatch(deleteContact({id : deleteModalData}))
      // setCurrentData((prevData) => prevData.filter((item) => item.id !== deleteModalData));
    }
    handleDeleteClose(); 
  };

  const updateHideShowStatus = (updatedStatus) => {
    if(updatedStatus){
      dispatch(updateFeedback({lang: "eng", id: updatedStatus?.id,}))
    }
  };

  return (
    <>
      <main>
        <div className="dashboard-wrap">
          <div className="contact-inner-tabs-wrap">
            <div className="toptab-pill-wrap">
              <div className="tab-pill-border">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                  <button
                      className={`nav-link ${activeTab === 'section-1' ? 'active' : ''}`}
                      id="section-1-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#section-1"
                      type="button"
                      role="tab"
                      aria-controls="section-1"
                      aria-selected={activeTab === 'section-1' ? "true" : "false"}
                      onClick={() => handleTabClick('section-1')}
                    >
                      Contact Us
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                  <button
                      className={`nav-link ${activeTab === 'section-2' ? 'active' : ''}`}
                      id="section-2-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#section-2"
                      type="button"
                      role="tab"
                      aria-controls="section-2"
                      aria-selected={activeTab === 'section-2' ? "true" : "false"}
                      onClick={() => handleTabClick('section-2')}
                    >
                      FAQs
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="section-1" role="tabpanel" aria-labelledby="section-tab" >
                <CsvDownloader datas={allContacts} filename="Contact us Data" >
                  <button type="button" className="influ-btn">
                    <img src="/images/menu-icons/export-icon.svg" alt="export" style={{ width: "22px" }} />
                      Export CSV
                  </button>
                </CsvDownloader>
                <div className="influ-table">
                  <div id="table-responsive-1" className="table-responsive">
                    <table>
                      <tbody>
                        <tr>
                          <th>S.No.</th>
                          <th>Name</th>
                          <th>Phone Number</th>
                          <th>Feedback</th>
                          <th>Feedback status</th>
                          <th>Action</th>
                        </tr>
                        
                        {currentData.length === 0 && <tr>
                          <td colSpan="8" style={{ padding: "40px 0", fontWeight: "bold", fontSize: "30px",}} >
                            No data found
                          </td>
                        </tr>}

                        {currentData.map((item, index) => (
                          <tr key={index}>
                            <td>{item.id}.</td>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>
                              <a style={{ color: "#2C0186", cursor:"pointer" }}  onClick={() => handleShow(item?.feedback_text)} > View </a>
                            </td>
                            <HideShow
                              item={{
                                id: item?.id,
                                status: item?.status,
                                name: "feedback status",
                              }}
                              updateHideShowStatus={updateHideShowStatus}
                            />
                            <td>
                              <div className="social-action-wrap">
                                <a style={{cursor:"pointer"}} onClick={() => handleDeleteShow(item.id)}>
                                  <img src="/images/menu-icons/delete-icon.svg" alt="" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr></tr>
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    data={filterData}
                    itemsPerPageOptions={[6, 50 , 100, 150 ,250, "all"]}
                    onPageDataChange={setCurrentData}
                  />
                </div>
              </div>
              <div className="tab-pane fade" id="section-2" role="tabpanel" aria-labelledby="section-tab" >
                <button type="button" className="influ-btn"  onClick={() => handleOpenModal()}>
                  <img src="/images/menu-icons/add-icon.svg" alt="" />
                  Add
                </button>
                <form onSubmit={(e) => e.preventDefault()}>
                  {!currentFAQData || currentFAQData?.length === 0 && (
                    <h1 style={{ fontSize:'36px', display:'flex', justifyContent:'center', padding:"100px 0"}}>No data found </h1>
                 )}

                  {currentFAQData?.map((item, index) => (
                      <div className="faq-wrap" key={index}>
                        <div className="faq-inner">
                          <div className="faq-quest-wrap">
                            <h3>{item.faq_que}</h3>
                          </div>
                          <div className="faq-anser-wrap">
                            <p>{item.faq_ans}</p>
                          </div>
                        </div>
                        <div className="action-faq">
                          <img src="/images/menu-icons/edit-faq-icon.svg" style={{cursor:'pointer'}} alt="" onClick={() => handleOpenModal(item)}/>
                          <img src="/images/menu-icons/delete-icon.svg" style={{cursor:'pointer'}} alt="" onClick={() => handleFaqDeleteShow(item.id)}/>
                          {/* </a> */}
                        </div>
                      </div>
                    ))
                  }
                </form>
                <Pagination
                  data={filterFaqData}
                  itemsPerPageOptions={[5, 10, "all"]}
                  onPageDataChange={setCurrentFAQData}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    
      <FeedbackPopup
        show={show}
        handleClose={handleClose}
        modalData={currentModalData}
      />
      
      <DeletePopup
        show={deleteShow}
        handleClose={handleDeleteClose}
        handleDelete={handleDelete}
        modalData={deleteModalData}
      />

      <DeletePopup
        show={faqShow}
        handleClose={handleFaqDeleteClose}
        handleDelete={handleFaqDelete}
        modalData={faqModalData}
      />
      <AddEditFaq
        show={showModal}
        handleClose={handleCloseModal}
        handleAddEdit={handleAddEditFaq}
        initialData={selectedFaq}
      />
    </>
  );
};

export default ContactFaq;

const FeedbackPopup = ({ show, handleClose, modalData }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="sm"
      aria-labelledby="feedback-popup-modal"
      centered
    >
      <Modal.Body>
        <div className="logout-pop-wrap">
          <button type="button" className="close close-btn-front"  data-bs-dismiss="modal" aria-label="Close"
            onClick={handleClose}> 
            <img src="/images/menu-icons/close-popup-icon.svg" alt="Close" />
          </button>
          <div className="common-pop-warp">
            <h3 className="text-center fw-bold">Feedback</h3>
            <p>{modalData || "Feedback not available"}</p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

  
