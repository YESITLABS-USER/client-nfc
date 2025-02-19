import React, { useState, useEffect, useCallback } from "react";
import Pagination from "../components/Pagination";
import CustomDateRangePicker from "../components/DateRangePicker";
import { format } from "date-fns";
import CsvDownloader from "react-csv-downloader";
import DeletePopup from "../components/DeletePopup";
import { deleteUser, getAllUser } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {CreateNewUserPopup, EditUserModal} from "../components/AddUserModal";
import { formatDate, formatUrl, handleGlobalSearch } from "../assets/common";

const UserManagement = () => {
  const dispatch = useDispatch();

  // Get the user data from Redux store (assuming you have a state slice for users)
  const { user, loading } = useSelector((state) => state.user);
  const [currentData, setCurrentData] = useState([]); // For the current user data displayed
  const [show, setShow] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [currentModalData, setCurrentModalData] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Dispatch the action to fetch the user data when the component mounts
    dispatch(getAllUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFilteredData(user?.data); 
      setCurrentData(user?.data); 
    }
  }, [user]);

  const handleShow = (modalData) => {
    setCurrentModalData(modalData);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setCurrentModalData(null);
  };

  const handleDelete = () => {
    if (currentModalData) {
      dispatch(deleteUser({id : currentModalData}))
      // setCurrentData((prevData) =>
      //   prevData.filter((item) => item?.id !== currentModalData)
      // );
    }
    handleClose(); 
  };

  const handleShowEditModal = (userData) => {
    setSelectedUser(userData);
    setShowEdit(true);
  };

  const handleCloseEditModal = () => {
    setShowEdit(false);
  };

  const handleCreateClose = () => setShowCreate(false);
  
  const handleDateSearch = (dateRange) => {
    const [startDate, endDate] = dateRange.map((date) => {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      return normalizedDate;
    });
      
    const filteredData = user?.data.filter((item) => {
      const itemDate = new Date(item.created_at);
      itemDate.setHours(0, 0, 0, 0); 
      return itemDate >= startDate && itemDate <= endDate;
    });
  
    setFilteredData(filteredData); 
  };
  
  // Function to handle date range selection
  const handleApply = useCallback((range) => {
    if (range?.length === 2) {
      const formattedDates = range.map((date) => format(date, "yyyy-MM-dd"));
      handleDateSearch(formattedDates);
    }
  }, [handleDateSearch]);

  const handleDateCancel = () => {
    setFilteredData(user?.data); 
  };

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
                        const result = handleGlobalSearch(value, user?.data);
                        setFilteredData(result);
                      } else {
                        setFilteredData(user?.data)
                      }
                    }}
                  />
                  <button>
                    <img src="/images/menu-icons/search-icon.png" alt="search" />
                  </button>
                </label>
              </div>
              <div className="influ-btns">
                <CustomDateRangePicker onApply={handleApply} onCancel={handleDateCancel}/>
                <button
                  type="button"
                  className="influ-btn"
                  onClick={() => {
                    setShowCreate(true);
                  }}
                >
                  <img
                    src="/images/jungleballers-imgs/request-icon.svg"
                    alt=""
                  />
                  Create New User
                </button>
                <CsvDownloader
                  datas={user?.data}
                  filename="User Management Data"
                >
                  <button className="influ-btn">
                    <img src="/images/menu-icons/export-icon.svg" alt="" />
                    Export csv
                  </button>
                </CsvDownloader>
              </div>
            </form>
          </div>

          <div className="influ-table">
            <div id="table-responsive-1" className="table-responsive">
              <table>
                <tbody>
                  <tr>
                    <th>Sr no</th>
                    <th>User name</th>
                    <th>User ID</th>
                    <th>Date of register</th>
                    <th>Validation status</th>
                    <th>User URL</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone number</th>
                    <th>Email</th>
                    <th>Date of birth</th>
                    <th>Gender</th>
                    <th>User status</th>
                    <th>Action</th>
                  </tr>

                  {!loading ? (
                    <>
                      {!currentData || currentData?.length === 0 && (
                        <tr>
                          <td colSpan="8" style={{ padding: "40px 0", fontWeight: "bold", fontSize: "30px",}} >
                            No data found
                          </td>
                        </tr>
                      )}

                      {currentData &&
                        currentData.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.serial_number}</td>
                            <td>{item?.user_name}</td>
                            <td>{item?.user_id}</td>
                            <td>{formatDate(item?.created_at)}</td>
                            <td>
                              {item?.validation_status ? "true" : "false"}
                            </td>
                            <td>
                              <a href={formatUrl(item?.user_url)} className="table-link">
                                {item?.user_url?.slice(0, 20)}
                              </a>
                            </td>
                            <td>{item?.first_name}</td>
                            <td>{item?.last_name}</td>
                            <td>{item?.phone_number}</td>
                            <td> <a href={`mailto:${item?.email}`}  className="table-link">{item?.email}</a></td>
                            <td>{item?.date_of_birth}</td>
                            <td> {item?.gender == 0 ? "Male" : item?.gender === 1 ? "Female" : "Other"} </td>

                            <td>
                              <div
                                className={
                                  !item?.deleted_at
                                    ? "active-wpp"
                                    : "deactive-wpp"
                                }
                              >
                                {!item?.deleted_at ? "Active" : "Deleted"}
                              </div>
                            </td>
                            <td>
                              <div className="social-action-wrap">
                                <a onClick={() => handleShowEditModal(item)}>
                                  <img src="/images/menu-icons/edit-icon.svg" alt="edit" className="action-icon"/>
                                </a>
                                <a onClick={() => handleShow(item?.id)} >
                                  <img src="/images/menu-icons/delete-icon.svg" alt="delete" className="action-icon" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ padding: "40px 0", fontWeight: "bold", fontSize: "30px",}} >
                        Loading...
                      </td>
                    </tr>
                  )}
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

      <DeletePopup
        show={show}
        handleClose={handleClose}
        handleDelete={handleDelete}
        modalData={currentModalData}
      />

      <CreateNewUserPopup show={showCreate} handleClose={handleCreateClose} />

      <EditUserModal
        show={showEdit}
        handleClose={handleCloseEditModal}
        userData={selectedUser}
      />
    </div>
  );
};

export default UserManagement;