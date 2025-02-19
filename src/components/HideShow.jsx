import { useState } from "react";
import { Modal } from "react-bootstrap"; // Assuming you're using React Bootstrap for modals

const HideShow = ({ item, updateHideShowStatus }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Handles the change in the toggle state (show/hide)
  const handleToggleStatusChange = () => {
    setSelectedStatus(item); // Store the selected item for toggling
    setIsModalVisible(true); // Show the confirmation modal
  };

  // Handles the confirmation of the action (show/hide toggle)
  const handleStatusConfirm = () => {
    if (selectedStatus) {
      // Prepare the updated campaign status
      const updatedCampaign = {
        ...selectedStatus,
        status: !selectedStatus.status, // Toggle the status
      };

      // Call the parent update function
      updateHideShowStatus(updatedCampaign);
    }

    // Close the modal after confirming
    setIsModalVisible(false);
  };

  // Handles closing the modal without making changes
  const handleStatusClose = () => {
    setIsModalVisible(false); // Simply close the modal
  };

  return (
    <>
      <td>
        <div className="toggle-wrap">
          <p style={{ color: "#2C0186" }}>{item?.name == "Feedback Status" ? "Approved" : "Hide"}</p>
          <div className="toggle">
            <input
              type="checkbox"
              checked={!!item?.status}
              onChange={handleToggleStatusChange}
            />
            <label></label>
          </div>
          <p style={{ color: "#2C0186" }}>{item?.name == "Feedback Status" ? "Pending" : "Show"}</p>
        </div>
      </td>

      {/* The modal for confirming the toggle action */}
      {isModalVisible && (
        <Modal className="hide-show-popup" show={isModalVisible} onHide={handleStatusClose}>
          <Modal.Body style={{ position: "relative" }}>
            <div className="logout-pop-wrap">
              <img
                src="/images/menu-icons/close-popup-icon.svg"
                alt="Close"
                onClick={handleStatusClose}
                style={{ position: "absolute", right: "15px", top: "15px" }}
              />
              <form>
                <div className="logout-img-wrap">
                  <img
                    src="/images/menu-icons/hide-popup-icon.svg"
                    alt=""
                    style={{ width: "38%" }}
                  />
                </div>
                {/* <p>
                  Are you sure that you want to
                  <br /> {selectedStatus?.status ? ("hide") : "show"} the {item.name}?
                </p> */}
                <p style={{fontWeight:"bold"}}> Are you sure you want to <br />
                  {selectedStatus?.status ? item?.name == "Feedback Status" ? "Approve" : "Hide" : 
                    item?.name === "Feedback Status" ? "Pending" : "Show"} the {item.name}? 
                </p>
                
                <div className="all-commonbtns-popup">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default behavior
                      handleStatusClose(); // Close the modal
                    }}
                    aria-label="Cancel"
                  >
                    Cancel
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default behavior
                      handleStatusConfirm(); // Confirm the action
                    }}
                    aria-label="Confirm"
                  >
                    Confirm
                  </a>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default HideShow;
