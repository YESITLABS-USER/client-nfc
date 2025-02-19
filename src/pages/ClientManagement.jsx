import React, { useState, useEffect, useCallback } from "react";
import DeletePopup from "../components/DeletePopup";
import { Modal } from "react-bootstrap";
import Pagination from "../components/Pagination";
import CustomDateRangePicker from "../components/DateRangePicker";
import { useNavigate } from "react-router-dom";
import SearchDropdown from "../components/SearchDropdown";
import HideShow from "../components/HideShow";
import { useDispatch, useSelector } from "react-redux";
import { getAllClients, deleteClient, updatedLandingStatus } from "../redux/slices/clientSlice";
import { format } from "date-fns";
import noImage from "/no_image.png";
import { formatDate, formatUrl, handleGlobalSearch } from "../assets/common";
import CsvDownloader from "react-csv-downloader";

const ClientManagement = () => {
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.clients);
  const [currentData, setCurrentData] = useState([]);
  const [filteredData, setFilteredData] = useState(clients);
  const [show, setShow] = useState(false);

  const [currentModalData, setCurrentModalData] = useState({});
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [showCustomModal, setCustomModal] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);

  useEffect(() => {
    if (clients) {
      setFilteredData(clients); 
      setCurrentData(clients); 
    }
  }, [clients]);

  const handleShow = (modalData) => {
    setCurrentModalData(modalData);
    setShow(true);
  };
  
  const handleClose = () => {
    setShow(false)
    setCurrentModalData(null);
  };
  // For Image View
  const handleCustomShow = (modalData) => {
    setCurrentModalData(modalData);
    setCustomModal(true);
  };
  
  const handleCustomClose = () => {
    setCustomModal(false)
    setCurrentModalData(null);
  };
  
  const handleLocationSearchValue = (data) => {
    const searchValue = data.trim(); // Trim input value to remove extra spaces
    if (searchValue) {
      setFilteredData(clients.filter((item) => item?.location_name.toLowerCase().includes(searchValue.toLowerCase()))
    );
    } else {
      setFilteredData(clients);
    }
  };

  const updateHideShowStatus = (updatedStatus) => {
    if(updatedStatus){
      dispatch(updatedLandingStatus({lang: "eng", id: updatedStatus?.id,}))
    }
  };


  const handleUpdateClient = (item) => {
    navigate(`/client-management/client-edit/${item?.id}`, { state: { data: item } });
  };
  
  const handleDelete = (item) => {
    if (currentModalData) {
      let payLoad = {
        lang: "eng",
        id: currentModalData?.id,
      };
      dispatch(deleteClient(payLoad))
    }
      handleClose();
    };
    
  const handleDateSearch = (dateRange) => {
    const [startDate, endDate] = dateRange.map((date) => {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      return normalizedDate;
    });
      
    const filteredData = clients.filter((item) => {
      const itemDate = new Date(item?.created_at);
      itemDate.setHours(0, 0, 0, 0); 
      return itemDate >= startDate && itemDate <= endDate;
    });
  
    setFilteredData(filteredData); 
  };

  const handleApply = useCallback(
    (range) => {
      if (range?.length === 2) {
        const formattedDates = range.map((date) => format(date, "yyyy-MM-dd")); // Format as yyyy-MM-dd
        handleDateSearch(formattedDates);
      }
    },
    [handleDateSearch]
  );
  
  const handleDateCancel = () => {
    setFilteredData(clients); 
  };

  // For CSV Format
  function formatOpeningHours(openingHours) {
    const formattedOpeningHours = {};
  
    openingHours.forEach(item => {
      if (item.isClosed) {
        formattedOpeningHours[item.day] = "Closed";
      } else {
        formattedOpeningHours[item.day] = `${item.startTime} - ${item.endTime} - ${item.isClosed}`;
      }
    });
  
    return formattedOpeningHours;
  }
  
  function processBulkData(dataArray) {
    return dataArray.map(data => {
      const formattedOpeningHours = formatOpeningHours(data.opening_hours);
      const exportData = {
      Sr_no  : data?.serial_number,
      client_name  : data?.client_name,
      client_id  : data?.client_id,
      business_id  : data?.business_id,
      industry  : data?.industry,
      website_address  : data?.website_address,
      facebook  : data?.facebook,
      instagram  : data?.instagam,
      youtube  : data?.youtube,
      company_logo  : data?.company_logo,
      company_photo  : data?.company_photo,
      tiktok_link  : data?.tiktok_link,
      twitter_link  : data?.twitter_link,
      company_slogan  : data?.company_slogam,
      business_about_us  : data?.business_about_us,
      location_name  : data?.location_name,
      location_id  : data?.location_id,
      phone_number  : data?.phone_number,
      city  : data?.city,
      email  : data?.email,
      google_review_link  : data?.google_review_link,
      zip_code  : data?.zip_code,
      created_at  : formatDate(data?.created_at),
      landing_page_status  : data?.landing_page_status ? true : false,
      client_location_nfc_media_url : data?.client_location_nfc_media_url,

      ...formattedOpeningHours
      }

      delete exportData.id;
      delete exportData.updated_at;
      delete exportData.opening_hours;
      delete exportData.save_as_template;
  
      return exportData;
    });
  }

  const finalCsv = processBulkData(clients);
  return (
    <div>
      <main>
        <div className="dashboard-wrap">
          <div className="influ-strip-2">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="influ-search">
                <label htmlFor="">
                  <input type="text" placeholder="Search" 
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.trim()) {
                        const result = handleGlobalSearch(value, clients);
                        setFilteredData(result);
                      } else {
                        setFilteredData(clients)
                      }
                    }}
                  />
                  <button>
                    <img src="/images/menu-icons/search-icon.png" alt="search"/>
                  </button>
                </label>
              </div> 
              <div className="influ-btns">
              <CustomDateRangePicker onApply={handleApply} onCancel={handleDateCancel}/>
                <SearchDropdown
                  label="Client Location"
                  isOpen={showSearchInput}
                  setIsOpen={setShowSearchInput}
                  onSearchChange={handleLocationSearchValue}
                />
                <div className="influ-dropdown">
                  <button
                    className="influ-btn influ-more-drop-btn"
                    type="button"
                    onClick={() => setShowMoreFilters(!showMoreFilters)}
                  >
                    More Filters <i className="far fa-plus"></i>
                  </button>
                  {showMoreFilters && (
                    <div
                      className="influ-more-drop-list"
                      style={{ display: "block" }}
                    >
                      <div className="influ-more-drop-list-inner">
                        <button
                          type="button"
                          id="add-client"
                          className="influ-btn"
                          onClick={() => {
                            navigate("/client-management/add-client");
                          }}
                        >
                          {/* <img src="/images/jungleballers-imgs/request-icon.svg" alt="create" /> */}
                          Create Landing Page
                        </button>
                        <CsvDownloader datas={finalCsv} filename="Client Management Data" >
                          <button type="button" className="influ-btn">
                            <img src="/images/menu-icons/export-icon.svg" alt="export" style={{ width: "22px" }} />
                          Export CSV
                          </button>
                        </CsvDownloader>
                      </div>
                    </div>

                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="influ-table">
            <div id="table-responsive-1" className="table-responsive">
              <table>
                <tbody>
                  <tr>
                    <th>S.No.</th>
                    <th>Client Name</th>
                    <th>Client ID</th>
                    <th>Business ID</th>
                    <th>Business Industry</th>
                    <th>Date of Creation</th>
                    <th>Facebook Link</th>
                    <th>Instagram Link</th>
                    <th>YouTube Link</th>
                    <th>Business Logo</th>
                    <th>Business Photo</th>
                    <th>Business Slogan</th>
                    <th>Business About us</th>
                    <th>Client Location</th>
                    <th>Client Location ID</th>
                    {/* <th>Location Address</th> */}
                    <th>Zip</th>
                    <th>Country</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Google Review URL</th>
                    <th>Client Location NFC Media URL</th>
                    <th>Campaign Detail</th>
                    <th>Landing page status</th>
                    <th>Action</th>
                  </tr>

                  {currentData && currentData.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ padding: "40px 0", fontWeight: "bold", fontSize: "30px",}}>
                        No data found
                      </td>
                    </tr>
                  )}
                  {/* Dynamic Table Rows */}
                  {currentData?.map((item, index) => (
                    <tr key={index}>
                      <td>{item?.serial_number}</td>
                      <td>{item?.client_name}</td>
                      <td>{item?.client_id}</td>
                      <td>{item?.business_id}</td>
                      <td>{item?.industry}</td>
                      <td>{formatDate(item?.created_at)}</td>
                      <td>
                        <a href={formatUrl(item?.facebook)} target="_blank" className="table-link" >
                          {item?.facebook.slice(0, 20)}
                        </a>
                      </td>
                      <td>
                        <a href={formatUrl(item?.instagam)} target="_blank" className="table-link" >
                          {item?.instagam.slice(0, 20)}
                        </a>
                      </td>
                      <td>
                        <a href={formatUrl(item?.youtube)} target="_blank" className="table-link" >
                          {item?.youtube.slice(0, 20)}
                        </a>
                      </td>
                      <td>
                        <a href="" className="modal-trigger"
                          onClick={(e) => { 
                            e.preventDefault();
                            handleCustomShow({
                              id: "business-logo",
                              title: "Business Logo",
                              contentType: "image",
                              imageSrc: item?.company_logo,
                            });
                          }}
                        >
                          View
                        </a>
                      </td>
                      <td>
                        <a href="" className="modal-trigger"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCustomShow({
                              id: "business-photo",
                              title: "Business Photo",
                              contentType: "image",
                              imageSrc:
                                item?.company_photo,
                            }); 
                          }} >
                          View
                        </a>
                      </td>
                      <td>
                        <a href="" className="modal-trigger"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCustomShow({
                              id: "business-slogan",
                              title: "Business Slogan",
                              contentType: "text",
                              textContent: item?.company_slogam,
                              contentClassName: "business-slogan",
                            });
                          }} >
                          View
                        </a>
                      </td>
                      <td>
                        <a href="" className="modal-trigger"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCustomShow({
                              id: "business-aboutus",
                              title: "Business About Us",
                              contentType: "text",
                              textContent: item?.business_about_us,
                              contentClassName: "business-about-us",
                            });
                          }} >
                          View
                        </a>
                      </td>
                      <td>{item?.location_name}</td>
                      <td>{item?.location_id}</td>
                      {/* <td>{item?.location_address}</td> */}
                      <td>{item?.zip_code}</td>
                      <td> Finland </td>
                      <td>{item?.phone_number}</td>
                      <td><a href={`mailto:${item?.email}`}>{item?.email}</a></td>
                      <td>
                      <a href={formatUrl(item?.google_review_link)} target="_blank" className="table-link">
                          {item?.google_review_link?.slice(0, 20)}
                        </a>
                      </td>
                      <td> {item?.client_location_nfc_media_url ?? "Not Available"} </td>
                      <td>
                        <a onClick={() => navigate(`/client-management/campaign-detail`, {state : {data:item}})} className="table-link" >
                          View
                        </a>
                      </td>
                      <HideShow
                        item={{
                          id: item?.id,
                          status: item?.landing_page_status,
                          name: "Landing page status",
                        }}
                        updateHideShowStatus={updateHideShowStatus}
                      />
                      <td>
                        <div className="social-action-wrap">
                          <a>
                            <img src="/images/menu-icons/edit-icon.svg" alt="edit" className="action-icon" onClick={() => handleUpdateClient(item)} />
                          </a>
                          <a onClick={() => handleShow(item)}>
                            <img src="/images/menu-icons/delete-icon.svg" alt="delete" className="action-icon" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              data={filteredData}
              itemsPerPageOptions={[10, 50, 100, 150, 250, "all"]}
              onPageDataChange={setCurrentData}
            />
          </div>
        </div>
      </main>

      <CustomModal
        show={showCustomModal}
        handleClose={handleCustomClose}
        modalData={currentModalData}
      />
      <DeletePopup
        show={show}
        handleClose={handleClose}
        handleDelete={handleDelete}
        modalData={currentModalData}
      />
    </div>
  );
};

export default ClientManagement;

const CustomModal = ({ show, handleClose, modalData }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal fade"
      id={modalData?.id}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div className="modal-dialog-edit" role="document">
        <div className="modal-content clearfix">
          <div className="modal-heading">
            <button
              type="button"
              className="close close-btn-front"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            >
              <img src="/images/menu-icons/close-popup-icon.svg" alt="Close" />
            </button>
          </div>
          <div className="modal-body">
            <div className="logout-pop-wrap">
              <h2>{modalData?.title}</h2>
            </div>
            {modalData?.contentType === "image" && (
              <div className="business-logo-img">
                <img src={modalData.imageSrc ? `${import.meta.env.VITE_BACKEND_URL}/${modalData.imageSrc}` : noImage}
                  alt={modalData?.title || "no image availabel"} style={{maxWidth:'200px'}}
                />
              </div>
            )}
            {modalData?.contentType === "text" && (
              <div className={modalData?.contentClassName}>
                <p>{modalData?.textContent}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
