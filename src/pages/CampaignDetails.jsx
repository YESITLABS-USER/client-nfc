import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClientCampaign, getClientCampaign, UpdateClientCampaignStatus } from '../redux/slices/clientSlice';
import HideShow from '../components/HideShow';
import DeletePopup from '../components/DeletePopup';

const CampaignDetails = () => {
  const location = useLocation();
  const { data } = location.state || {};
  const dispatch = useDispatch();
  const { clientCampaign } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(getClientCampaign({client_id : data?.id}))
  },[data])

  const [filteredData, setFilteredData] = useState(clientCampaign ?? []);
  const [currentData, setCurrentData] = useState([]); 
    const [currentDeleteData, setCurrentDeleteData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleGlobalSearch = (value) => {
    const lowerCaseSearchText = value.toLowerCase();
    const filtered = clientCampaign.filter((item) => {
      return Object.values(item)
        .filter((value) => typeof value === "string" || typeof value === "number") 
        .join(" ")
        .toLowerCase()
        .includes(lowerCaseSearchText);
    });
    setFilteredData(filtered);
  };

  const handleCancelGlobalSearch = () => {
    setFilteredData(clientCampaign); 
  };

    useEffect(() => {
      if (clientCampaign) {
        setFilteredData(clientCampaign); 
      }
    }, [clientCampaign]);

  const updateHideShowStatus = (updatedStatus) => {
    dispatch(UpdateClientCampaignStatus({id: updatedStatus?.id, client_id: data?.id}));
  };


  const handleDeleteShow = (modalData) => {
    setCurrentDeleteData(modalData);
    setShowDeleteModal(true);
  };
  
  const handleClose = () => {
    setShowDeleteModal(false);
    setCurrentDeleteData(null);
  };
  
  const handleDelete = () => {
    if (currentDeleteData) {
      dispatch(deleteClientCampaign({id : currentDeleteData, client_id : data?.id}));
    }
    handleClose(); 
  };


  return (
    <main>
      <div className="dashboard-wrap">
        <div className="back-and-heading-wrap">
          <h1>
            <a href="/client-management">
              <img src="/images/menu-icons/left-arrow.png" alt="" />
            </a>
            &nbsp;{data?.client_name ?? "Olo Restaurant"} - {data?.location_name ?? "123-Streets"}
          </h1>
        </div>
        <div className="influ-strip-2">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="influ-search">
              <label>
              <input type="text" placeholder="Search"
                  onKeyDown={(e) => { if (e.key === "Enter") { handleGlobalSearch(e.target.value); } }}
                  onChange={(e) => {
                  const value = e.target.value;
                    if (value.trim()) { handleGlobalSearch(value); }
                    else { handleCancelGlobalSearch(e.target.value); }
                }} />
                <button>
                  <img src="../images/menu-icons/search-icon.png" alt="" />
                </button>
              </label>
            </div>
          </form>
        </div>
        <div className="influ-table">
          <div id="table-responsive-1" className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Campaign Name</th>
                  <th>Total Number of Tag</th>
                  <th>Number of Coupons</th>
                  <th>Number of Loyalty card</th>
                  <th>Campaign status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.length == 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item?.id}</td>
                      <td>{item?.campaign_name}</td>
                      <td>{item?.total_tags_count}</td>
                      <td>{item?.total_coupon_count}</td>
                      <td>{item?.total_loyalty_count}</td>
                      <HideShow item={{ id: item?.id, status: item?.campaign_status, name: "Campaign" }} updateHideShowStatus={updateHideShowStatus}
                       />

                      <td>
                        <div className="social-action-wrap">
                        <a> <img src="/images/menu-icons/delete-icon.svg" alt="delete" onClick={()=> handleDeleteShow(item?.id)}/> </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredData.length > 0 && (
            <Pagination
            data={filteredData}
            itemsPerPageOptions={[10, 50, 100, 150, 250, "all"]}
            onPageDataChange={setCurrentData}
          />
          )}
        </div>
      </div>
      <DeletePopup
        show={showDeleteModal}
        handleClose={handleClose}
        handleDelete={handleDelete}
        modalData={currentDeleteData}
      />
    </main>
  );
};

export default CampaignDetails;
