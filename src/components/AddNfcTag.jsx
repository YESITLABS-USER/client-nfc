import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createNfcTag, editNfcTag, getAllClients, getAllLocations } from "../redux/slices/nfcTagSlice";

const AddNfcTag = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { allClients, allClientLocation, client_loading, location_loading} = useSelector( (state) => state.nfcTag );
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);

  useEffect(() => {
    if (clientId) {
      dispatch(getAllLocations({ client_id: clientId }));
    }
  }, [clientId, dispatch]);

  const initialValues = {
    client_id: "",
    client_name: "",
    client_table_id: "",
    location_name: "",
    client_location: "",
    tag_url: "",
    location_tag_placement: "",
    tag_type: "",
  };

  const validationSchema = Yup.object({
    client_id: Yup.string().required("Client name is required"),
    client_table_id: Yup.string().required("Client location is required"),
    tag_url: Yup.string().required("Tag URL is required"),
    location_tag_placement: Yup.string().required("Tag placement is required"),
    tag_type: Yup.string().required("Tag type is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const cc = await dispatch(createNfcTag(values));
      if (cc.payload?.status === "success") {
        handleClose();
      }
    } catch (error) {
      console.error('Error creating NFC tag:', error);
    } 
  };
  
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <div className="modal-content clearfix">
        <div className="modal-heading">
          <button
            type="button"
            className="close close-btn-front"
            onClick={handleClose}
          >
            <img src="/images/menu-icons/close-popup-icon.svg" alt="" />
          </button>
        </div>
        <div className="modal-body">
          <div className="common-form-wrap">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="common-pop-warp">
                    <h3>Create New NFC Media Tag</h3>
                    <div className="creat-new-user-wrap">
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-lg-4">
                            <label>
                              <h3>Client name</h3>
                              <Field as="select" name="client_id"
                                onChange={(e) => {
                                  const selectedClientId = e.target.value;
                                  setClientId(selectedClientId);
                                  const data = allClients.find( (item) => item?.client_id == selectedClientId );
                                  setFieldValue("client_id", selectedClientId);
                                  setFieldValue("client_name", data.client_name );
                                }} >
                                <option value="">Select client</option>
                                {client_loading && <option value="">Loading...</option>}
                                {allClients.length == 0 && <option value=""> No client Found</option>}
                                {allClients?.map((item) => (
                                  <option key={item?.id} value={item?.client_id}>
                                    {item?.client_name} - ({item?.client_id})
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="client_id" component="div" className="error-message d-flex"
                                style={{ color: "red", fontSize: "12px", paddingLeft: "10px", }}
                              />
                            </label>
                          </div>
                          <div className="col-lg-4"></div>
                          <div className="col-lg-4"></div>
                          <div className="col-lg-4">
                            <label className="selected-id">
                              <h3>Tag ID</h3>
                              <input type="text" defaultValue="Not required" readOnly />
                            </label>
                          </div>
                          <div className="col-lg-4">
                            <label>
                              <h3>Client Location</h3>
                              <Field as="select" name="client_table_id" 
                                onChange={(e) => {
                                  const selectedLocationId = e.target.value;
                                  const selectedLocation = allClientLocation?.find( (item) => item?.client_table_id == 
                                    selectedLocationId );
                                  if (selectedLocation) {
                                    setFieldValue("client_location", selectedLocation.location_name);
                                    setFieldValue("client_table_id", selectedLocationId );
                                  } else {
                                    setFieldValue("client_location", "");
                                    setFieldValue("client_table_id", "");
                                  }
                                }} >
                                <option value="">Select client location</option>
                                {location_loading && <option value="">Loading...</option>}
                                {allClientLocation.length == 0 && <option value=""> No client location Found</option>}
                                {allClientLocation?.map((item) => (
                                  <option key={item?.client_table_id} value={item?.client_table_id} >
                                    {item?.location_name?.slice(0,25)} - (
                                    {item?.client_table_id})
                                  </option>
                                ))}
                              </Field>

                              <ErrorMessage name="client_table_id" component="div" className="error-message d-flex"
                                style={{ color: "red", fontSize: "12px", paddingLeft: "10px", }}
                              />
                            </label>
                          </div>
                          <div className="col-lg-4">
                            <label>
                              <h3>Tag URL</h3>
                              <Field type="text" name="tag_url" placeholder="Enter Tag URL" />
                              <ErrorMessage name="tag_url" component="div" className="error-message d-flex"
                                style={{ color: "red", fontSize: "12px", paddingLeft: "10px", }}
                              />
                            </label>
                          </div>
                          <div className="col-lg-8">
                            <label>
                              <h3>Location tag placement</h3>
                              <Field type="text" name="location_tag_placement" placeholder="Enter Location tag placement"/>
                              <ErrorMessage name="location_tag_placement" component="div" className="error-message d-flex" style={{ color: "red", fontSize: "12px", paddingLeft: "10px", }}
                              />
                            </label>
                          </div>
                          <div className="col-lg-4">
                            <label>
                              <h3>Tag type</h3>
                              <Field type="text" name="tag_type" placeholder="Enter Tag type" />
                              <ErrorMessage name="tag_type" component="div" className="error-message d-flex"
                                style={{ color: "red", fontSize: "12px", paddingLeft: "10px", }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="big-modal-common-btns">
                        <button type="submit">
                          <a style={{ color: "white" }}> ADD </a>
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddNfcTag;

const EditNfcTag = ({ show, handleClose, editData }) => {
  const dispatch = useDispatch();
  const { allClients, allClientLocation } = useSelector((state) => state.nfcTag);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);

  useEffect(() => {
    if (clientId || editData?.client_id) {
      dispatch(getAllLocations({ client_id: clientId || editData?.client_id }));
    }
  }, [clientId, dispatch, editData]);
 

  const initialValues = {
    id: editData?.id,
    client_id: editData?.client_id || "",
    client_name: editData?.client_name || "",
    client_table_id: editData?.client_table_id || "",
    location_id : editData?.location_id || "",
    client_location: editData?.location_name || "",
    tag_id: editData?.tag_id || "",
    tag_url: editData?.tag_url || "",
    location_tag_placement: editData?.location_tag_placement || "",
    tag_type: editData?.tag_type || "",
  };

  const validationSchema = Yup.object({
    client_id: Yup.string().required("Client name is required"),
    client_table_id: Yup.string().required("Client location is required"),
    tag_url: Yup.string().required("Tag URL is required"),
    location_tag_placement: Yup.string().required("Tag placement is required"),
    tag_type: Yup.string().required("Tag type is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await dispatch(editNfcTag(values));
  
      if (res?.payload?.status === "success") {
        handleClose();
      } else {
        console.log("Unexpected response:", res);
      }
    } catch (error) {
      console.error("Error in editNfcTag:", error);
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <div className="modal-content clearfix">
        <div className="modal-heading">
          <button type="button" className="close close-btn-front" onClick={handleClose}>
            <img src="/images/menu-icons/close-popup-icon.svg" alt="" />
          </button>
        </div>
        <div className="modal-body">
          <div className="common-form-wrap">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="common-pop-warp">
                    <h3>Edit NFC Media Tag</h3>
                    <div className="creat-new-user-wrap">
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-lg-4">
                            <label>
                              <h3>Client Name</h3>
                              <Field
                                as="select"
                                name="client_id"
                                onChange={(e) => {
                                  const selectedClientId = e.target.value;
                                  setClientId(selectedClientId);
                                  const data = allClients.find(
                                    (item) => item?.client_id === selectedClientId
                                  );
                                  setFieldValue("client_id", selectedClientId);
                                  setFieldValue("client_name", data?.client_name || "");
                                }}
                              >
                                <option value="">Select Client</option>
                                {allClients.map((item) => (
                                  <option key={item?.id} value={item?.client_id}>
                                    {item?.client_name} - ({item?.client_id})
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name="client_id"
                                component="div"
                                className="error-message"
                                style={{ color: "red", fontSize: "12px" }}
                              />
                            </label>
                          </div>
                          <div className="col-lg-4"></div>
                          <div className="col-lg-4"></div>
                          <div className="col-lg-4">
                            <label className="selected-id">
                              <h3>Tag ID</h3>
                              <Field
                                type="text"
                                name="tag_id"
                                value={values.tag_id}
                                readOnly
                              />
                            </label>
                          </div>
                          <div className="col-lg-4">
                            <label>
                              <h3>Client Location</h3>
                              <Field
                                as="select"
                                name="client_table_id"
                                onChange={(e) => {
                                  const selectedLocationId = e.target.value;
                                  const selectedLocation = allClientLocation.find(
                                    (item) => item?.client_table_id == selectedLocationId
                                  );
                                  setFieldValue("client_table_id", selectedLocationId);
                                  setFieldValue("location_id", selectedLocation?.location_id);
                                  setFieldValue("client_location",selectedLocation?.location_name || "");
                                }}
                              >
                                <option value="">Select Client Location</option>
                                {allClientLocation.map((item) => (
                                  <option
                                    key={item?.client_table_id}
                                    value={item?.client_table_id}
                                  >
                                    {item?.location_name?.slice(0,25)} - ({item?.client_table_id})
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name="client_table_id"
                                component="div"
                                className="error-message"
                                style={{ color: "red", fontSize: "12px" }}
                              />
                            </label>
                          </div>
                          <div className="col-lg-4">
                            <label>
                              <h3>Tag URL</h3>
                              <Field
                                type="text"
                                name="tag_url"
                                placeholder="Enter Tag URL"
                              />
                              <ErrorMessage
                                name="tag_url"
                                component="div"
                                className="error-message"
                                style={{ color: "red", fontSize: "12px" }}
                              />
                            </label>
                          </div>
                          <div className="col-lg-8">
                            <label>
                              <h3>Location Tag Placement</h3>
                              <Field
                                type="text"
                                name="location_tag_placement"
                                placeholder="Enter Location Tag Placement"
                              />
                              <ErrorMessage
                                name="location_tag_placement"
                                component="div"
                                className="error-message"
                                style={{ color: "red", fontSize: "12px" }}
                              />
                            </label>
                          </div>
                          <div className="col-lg-4">
                            <label>
                              <h3>Tag Type</h3>
                              <Field
                                type="text"
                                name="tag_type"
                                placeholder="Enter Tag Type"
                              />
                              <ErrorMessage
                                name="tag_type"
                                component="div"
                                className="error-message"
                                style={{ color: "red", fontSize: "12px" }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="big-modal-common-btns">
                        <button type="submit">
                          <a style={{ color: "white" }}>Update</a>
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Modal>
  );
};



export { AddNfcTag, EditNfcTag };
