import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { AddNfcTag, EditNfcTag } from "../components/AddNfcTag";
import DeletePopup from "../components/DeletePopup";
import SearchDropdown from "../components/SearchDropdown";
import { useDispatch, useSelector } from "react-redux";
import { deleteNfcTag, getAllNfcTags } from "../redux/slices/nfcTagSlice";
import { formatUrl, handleGlobalSearch } from "../assets/common";

const NFCManagement = () => {
  const dispatch = useDispatch();
  const { nfcTags } = useSelector((state) => state.nfcTag);

  const [filteredData, setFilteredData] = useState([]); // For filtered search results
  const [currentData, setCurrentData] = useState([]); 
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  

  useEffect(() => {
    dispatch(getAllNfcTags());
  },[dispatch])

  useEffect(() => {
    if(nfcTags) {
      setFilteredData(nfcTags);
    }
  },[nfcTags])

  const handleEditShow = (item) => {
    setEditData(item);
    setShowEditModal(true);
  };

  const handleShow = (modalData) => {
    setDeleteData(modalData);
    setShowDeletePopup(true);
  };

  const handleClose = () => {
    setShowDeletePopup(false);
    setDeleteData(null);
  };

  const handleDelete = () => {
    if (deleteData) {
      try {
        dispatch(deleteNfcTag({id: deleteData}))
        handleClose();
      } catch (error) {
        console.log('error in delete',error)
      }
    }
  };

  const handleLocationSearchValue = (data) => {
    const searchValue = data.trim();
    if (searchValue) {
      const locationFilteredData = nfcTags.filter((item) =>
        item?.location_name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(locationFilteredData);
    } else {
      setFilteredData(nfcTags); // Reset to original data
    }
  };

  return (
    <div>
      <main>
        <div className="dashboard-wrap">
          <div className="influ-strip-2">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="influ-search">
                <label>
                  <input type="text" placeholder="Search"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.trim()) {
                        const result = handleGlobalSearch(value, nfcTags);
                        setFilteredData(result);
                      } else {
                        setFilteredData(nfcTags)
                      }
                    }} />
                  <button>
                    <img src="/images/menu-icons/search-icon.png" alt="" />
                  </button>
                </label>
              </div>

              <div className="influ-btns">
                <SearchDropdown
                  label="Client Location"
                  isOpen={showLocationInput}
                  setIsOpen={setShowLocationInput}
                  onSearchChange={handleLocationSearchValue}
                />

                <button
                  type="button"
                  className="influ-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  <img
                    src="/images/jungleballers-imgs/request-icon.svg"
                    alt=""
                  />
                  Create New Tag
                </button>
              </div>
            </form>
          </div>
          <div className="influ-table">
            <div id="table-responsive-1" className="table-responsive">
              <table>
                <tbody>
                  <tr>
                    <th>Sr no</th>
                    <th>Client Name</th>
                    <th>Client Location</th>
                    <th>Tag ID</th>
                    <th>Tag URL</th>
                    <th>Location Tag Placement</th>
                    <th>Tag Type</th>
                    <th>Action</th>
                  </tr>

                  {currentData.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ padding: "40px 0", fontWeight: "bold", fontSize: "30px",}}>
                        No data found
                      </td>
                    </tr>
                  )}
                  {currentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item?.serial_number}</td>
                      <td>{item?.client_name}</td>
                      <td>{item?.location_name}</td>
                      <td>{item?.tag_id}</td>
                      <td>
                        <a href={formatUrl(item?.tag_url)}  target="_blank"  className="anchor-link">
                          {item?.tag_url.slice(0, 20)}
                        </a>
                      </td>
                      <td>{item?.location_tag_placement}</td>
                      <td>{item?.tag_type}</td>
                      <td>
                        <div className="social-action-wrap">
                          <a onClick={() => handleEditShow(item)}>
                            <img
                              src="/images/menu-icons/edit-icon.svg"
                              alt=""
                            />
                          </a>
                          <a onClick={() => handleShow(item?.id)}>
                            <img
                              src="/images/menu-icons/delete-icon.svg"
                              alt=""
                            />
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
      <DeletePopup
        show={showDeletePopup}
        handleClose={handleClose}
        handleDelete={handleDelete}
        modalData={deleteData}
      />

      <AddNfcTag
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />
      <EditNfcTag
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        editData={editData}
      />
    </div>
  );
};

export default NFCManagement;
