import { useEffect, useState, useCallback } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createUser, editUser, getUserId } from "../redux/slices/userSlice";
import { toast } from "react-toastify";

const CreateNewUserPopup = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { loading, userIdAndUrl } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    user_id: "",
    user_name: "",
    validation_status: "0",
    user_url: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch new user ID and URL on mount
  useEffect(() => {
    if (show) {
      dispatch(getUserId());
    }
  }, [show, dispatch]);

  // Update formData when userIdAndUrl is fetched
  useEffect(() => {
    if (userIdAndUrl) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: userIdAndUrl.unique_id || "",
        user_url: userIdAndUrl.url || "",
      }));
    }
  }, [userIdAndUrl]);

  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }, []);

  // Reset form data
  const resetForm = useCallback(() => {
    setFormData({
      user_id: "",
      user_name: "",
      validation_status: "0",
      user_url: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      date_of_birth: "",
      gender: "",
    });
    setErrors({});
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(createUser(formData));

      if (result.payload?.status === "success") {
        resetForm();
        handleClose();
      } else {
        const apiErrors = result.payload?.errors || {};
        setErrors(
          Object.keys(apiErrors).reduce(
            (acc, key) => ({
              ...acc,
              [key]: apiErrors[key]?.join(" ") || "Invalid value",
            }),
            {}
          )
        );
      }
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Body style={{ padding: "20px 50px" }}>
        <img
          src="/images/menu-icons/close-popup-icon.svg"
          alt="Close"
          variant="close"
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "absolute",
            right: "15px",
            width: "20px",
            height: "20px",
            cursor: "pointer",
          }}
        />
        <Modal.Title
          style={{ textAlign: "center", fontSize: "26px", fontWeight: "bold" }}
        >
          Create new user
        </Modal.Title>
        <Form style={{ paddingTop: "20px" }} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col lg={3}>
              <Form.Group>
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  type="text"
                  name="user_id"
                  value={formData.user_id}
                  readOnly
                  style={{ background: "#d2c9c9" }}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  placeholder="Jessie.Hodkiewicz"
                />
                {errors.user_name && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "12px",
                      paddingTop: "2px",
                      paddingLeft: "5px",
                    }}
                  >
                    {errors.user_name}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>Validation status</Form.Label>
                <Form.Select
                  name="validation_status"
                  value={formData.validation_status}
                  onChange={handleChange}
                >
                  <option value="1">True</option>
                  <option value="0">False</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>User URL</Form.Label>
                <Form.Control
                  type="text"
                  name="user_url"
                  value={formData.user_url}
                  onChange={handleChange}
                  placeholder="Enter URL"
                  readOnly
                  style={{ background: "#d2c9c9" }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col lg={3}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "12px",
                      paddingTop: "2px",
                      paddingLeft: "5px",
                    }}
                  >
                    {errors.email}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col lg={3}>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                />
                {errors.phone_number && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "12px",
                      paddingTop: "2px",
                      paddingLeft: "5px",
                    }}
                  >
                    {errors.phone_number}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange}
                    style={{ zIndex: 1 }} />
                    <img src="/images/menu-icons/calender-icon.png" alt="calendar-icon" 
                        style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                        pointerEvents: "none",
                        }}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange} >
                  <option value="">Select Gender</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                  <option value="0">Other</option>
                </Form.Select>
                {errors.gender && (
                  <div style={{ color: "red", fontSize: "12px", paddingTop: "2px", paddingLeft: "5px"}} >
                    {errors.gender}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <div className="big-modal-common-btns">
            <a href="#" onClick={(e) => { 
                e.preventDefault();
                handleSubmit(e);
              }}
              className="me-2"style={{ textDecoration: "none", cursor: "pointer" }} >
              {loading ? "Loading..." : "Save"}
            </a>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const EditUserModal = ({ show, handleClose, userData }) => {
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    id: userData?.id,
    user_id: "",
    user_name: "",
    validation_status: "0",
    user_url: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    gender: "0",
  });

  const [errors, setErrors] = useState({}); // State to store validation errors

  useEffect(() => {
    if (userData) {
      setFormValues({
        id: userData?.id,
        user_id: userData.user_id || "",
        user_name: userData.user_name || "",
        validation_status: userData.validation_status,
        user_url: userData.user_url || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        date_of_birth: convertDateFormat(userData.date_of_birth) || "",
        gender: userData.gender || "0",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    })); // Clear error for the field being changed
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const newErrors = validateForm();

  //   if (Object.keys(newErrors).length === 0) {
  //     console.log("Form submitted:", formValues);
  //     handleClose();
  //   } else {
  //     setErrors(newErrors);
  //   }
  // };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const result = await dispatch(editUser(formValues));
  
        if (result.payload?.status === "success") {
          toast.success("User Updated Successfully");
          handleClose();
        } else {
          const apiErrors = result.payload?.errors || {};
          setErrors(
            Object.keys(apiErrors).reduce(
              (acc, key) => ({
                ...acc,
                [key]: apiErrors[key]?.join(" ") || "Invalid value",
              }),
              {}
            )
          );
        }
      } catch (err) {
        console.error("Error creating user:", err);
      }
    };

  const convertDateFormat = (dateString) => {
    if (dateString && dateString.includes("/")) {
      const [month, day, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }
    return dateString || ""; // Return the original string if invalid
  };

  return (
    <Modal className="add-edit-user-popup" show={show} onHide={handleClose} size="xl">
      <Modal.Body style={{ padding: "20px 50px" }}>
        <img
          src="/images/menu-icons/close-popup-icon.svg"
          alt="Close"
          variant="close"
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "absolute",
            right: "15px",
            width: "20px",
            height: "20px",
            cursor: "pointer",
          }}
        />
        <Modal.Title style={{ textAlign: "center", fontSize: "26px", fontWeight: "bold" }} >
          Edit User
        </Modal.Title>
        <Form style={{ paddingTop: "20px" }} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col lg={3}>
              <Form.Group controlId="user_id">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  name="id"
                  type="text" disabled
                  value={formValues?.user_id}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group controlId="user_name">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  name="user_name"
                  type="text" disabled
                  placeholder="@Jessie.Hodkiewicz"
                  value={formValues?.user_name}
                  onChange={handleChange}
                />
                {errors.user_name && (
                  <div style={{ color: "red" }}>{errors.user_name}</div>
                )}
              </Form.Group>
            </Col>
            {/* <Col lg={3}>
              <Form.Group controlId="validationStatus">
                <Form.Label>Validation Status</Form.Label>
                <Form.Control
                  name="validation_status"
                  type="text"
                  placeholder="Yes"
                  value={formValues?.validation_status}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col> */}
            <Col lg={3}>
              <Form.Group>
                <Form.Label>Validation status</Form.Label>
                <Form.Select
                  name="validation_status"
                  value={formValues?.validation_status}
                  onChange={handleChange}
                >
                  <option value="1">True</option>
                  <option value="0">False</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group controlId="user_url">
                <Form.Label>User URL</Form.Label>
                <Form.Control
                  name="user_url"
                  type="text" disabled
                  placeholder="https://example.com"
                  value={formValues?.user_url}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group controlId="first_name">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="first_name"
                  type="text"
                  placeholder="First Name"
                  value={formValues?.first_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group controlId="last_name">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="last_name"
                  type="text"
                  placeholder="Last Name"
                  value={formValues?.last_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formValues?.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div style={{ color: "red" }}>{errors.email}</div>
                )}
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group controlId="phone_number">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  name="phone_number"
                  type="text"
                  placeholder="Phone Number"
                  value={formValues?.phone_number}
                  onChange={handleChange}
                />
                {errors.phone_number && (
                  <div style={{ color: "red" }}>{errors.phone_number}</div>
                )}
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group controlId="date_of_birth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  name="date_of_birth"
                  type="date" max={new Date().toISOString().split("T")[0]}
                  value={formValues?.date_of_birth}
                  onChange={handleChange}
                />
                {errors.date_of_birth && (
                  <div style={{ color: "red" }}>{errors.date_of_birth}</div>
                )}
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formValues?.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="0">Male</option>
                  <option value="1">Female</option>
                  <option value="2">Other</option>
                </Form.Select>
                {errors.gender && (
                  <div style={{ color: "red" }}>{errors.gender}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <div className="big-modal-common-btns">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="me-2"
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              Update
            </a>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export { CreateNewUserPopup , EditUserModal};
