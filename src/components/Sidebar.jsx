import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/adminSlice";
import { useDispatch } from "react-redux";
const Sidebar = () => {
  const location = useLocation();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [languages, setLanguages] = useState(() => {
    const storedLanguage = localStorage.getItem('language');
    return storedLanguage ? storedLanguage : 'eng';
  });

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguages(selectedLanguage);
    localStorage.setItem('language', selectedLanguage); // Store selected language in localStorage
    window.location.reload(false);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const isActive = (path) => {
    // return location.pathname === path ? "active" : "";
    return location.pathname.includes(path) ? "active" : ""; // for check path include or not in url
  };

  const sidebarData = [
    {
      name: "Client Management",
      path: "/client-management",
      imgSrc: "/images/menu-icons/2.svg",
    },
    {
      name: "User Management",
      path: "/user-management",
      imgSrc: "/images/menu-icons/1.svg",
    },
    {
      name: "Campaign Management",
      path: "/campaign-management",
      imgSrc: "/images/menu-icons/3.svg",
    },
    {
      name: "Coupons Management",
      path: "/coupons-management",
      imgSrc: "/images/menu-icons/4.svg",
    },
    {
      name: "Loyalty Cards Management",
      path: "/loyalty-cards-management",
      imgSrc: "/images/menu-icons/5.svg",
    },
    {
      name: "NFC Tags Management",
      path: "/nfc-tags-management",
      imgSrc: "/images/menu-icons/6.svg",
    },
    {
      name: "About Tagis",
      path: "/about-tagis",
      imgSrc: "/images/menu-icons/7.svg",
    },
    {
      name: "About Services",
      path: "/about-services",
      imgSrc: "/images/menu-icons/8.svg",
    },
    {
      name: "Contact us & FAQ",
      path: "/contact-us-faq",
      imgSrc: "/images/menu-icons/9.svg",
    },
    {
      name: "T&C And Privacy Policy",
      path: "/t&c-and-privacy-policy",
      imgSrc: "/images/menu-icons/10.svg",
    },
    { name: "Logout", path: "/logout", imgSrc: "/images/menu-icons/11.svg" },
  ];

  return (
    <>
      <section id="sidebar" className={isSidebarVisible ? "" : "hide"}>
        <Link to={"#"} className="brand">
          <img src="/images/menu-icons/MENU-LOGO.svg" alt="logo" />
        </Link>
        <ul className="side-menu">
          {sidebarData.map((item, index) => (
            <li key={index} className={isActive(item.path)}>
              <Link to={item.name === "logout" ? "#" : item.path} 
                onClick={(e) => {
                  if (item.name === "Logout") {
                    e.preventDefault();
                    handleLogout();
                  }
                }}>
                <img src={item.imgSrc} alt={item.name} />
                <span className="text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      
      <section id="content">
        <nav>
          <i className="bx bx-menu" onClick={toggleSidebar}>
            <img src="/images/menu-icons/hamburger.svg" alt="hamburger" />
          </i>
          { 
            location?.pathname !== "/user-management" && 
              <select value={languages} onChange={handleLanguageChange}  className="language-select">
                <option value="eng">English</option>
                <option value="fin">Finnish</option>
              </select>
          }
          <div className="admin-icon">
            <img src="/images/admin.svg" alt="admin" />
          </div>
        </nav>
      </section>

      <LogoutModal showModal={showModal} handleCloseModal={handleCloseModal}/>
    </>
  );
};

export default Sidebar;

const LogoutModal = ({showModal, handleCloseModal}) => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const nfcAdmin = JSON.parse(localStorage.getItem("nfc-admin"));
      const id = nfcAdmin ? nfcAdmin.id : null;
      await dispatch(logout({id}));
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <Modal className="logout-modal" show={showModal} onHide={handleCloseModal}>
        <div className="modal-content clearfix">
          <div className="modal-heading" style={{display:'flex', justifyContent:'right', paddingRight:'10px', paddingTop:'10px'}}>
              <img src="/images/menu-icons/close-popup-icon.svg" alt="close" style={{cursor:'pointer'}} onClick={handleCloseModal}/>
          </div>
          <Modal.Body>
            <div className="logout-pop-wrap">
              <form>
                <div className="logout-img-wrap">
                  <img src="/images/menu-icons/logout-icon.svg" alt="" />
                </div>
                <p>Are you sure you want to logout?</p>
                <div className="all-commonbtns-popup">
                  <Link onClick={handleLogout}> Yes</Link>
                  <Link to="#" onClick={handleCloseModal}>
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </Modal.Body>
        </div>
      </Modal>
  )
}