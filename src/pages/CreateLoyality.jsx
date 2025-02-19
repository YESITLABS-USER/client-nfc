import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { DatePicker, TimePicker } from "rsuite";
import * as Yup from "yup";
import { formatDate, formatTime } from "../assets/common";
import { useDispatch, useSelector } from "react-redux";
import { createLoyality, editLoyality, getAllCampaignLoyality, getAllClients, getAllLocations, getLoyalityUniqueId } from "../redux/slices/loyalitySlice";
import moment from "moment";

const LoyaltyCardForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};

  const isEditMode = data !== undefined;
  const dispatch = useDispatch();
  const { allClients, allClientLocation, loyalityUniqueId, allCampaigns, client_loading, location_loading } = useSelector((state) => state.loyality);
  
  const [loyaltyId, setLoyaltyId] = useState("");
  
  const [clientId, setClientId] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [finalCampaignId, setFinalCampaignId] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [logo, setLogo ] = useState(null);

  useEffect(() => {
    dispatch(getAllClients());
    dispatch(getLoyalityUniqueId());

    if (isEditMode) {
      setClientId(data?.client_id);
      setClientLocation({ client_location: data?.client_location, location_id: data?.location_id });
    }
  }, [dispatch, isEditMode, data]);

  useEffect(() => {
    if (clientId) {
      dispatch(getAllLocations({ client_id: clientId }));
    }
  }, [clientId, dispatch]);

  useEffect(() => {
    if (!isEditMode && loyalityUniqueId) {
      setLoyaltyId(loyalityUniqueId); 
    }
  }, [loyalityUniqueId, isEditMode]);

  useEffect(() => {
    if (clientId && clientLocation) {
      dispatch(getAllCampaignLoyality({ 
        client_id: clientId, 
        location_id: clientLocation?.location_id, 
        client_location: isEditMode ? clientLocation?.client_location : clientLocation?.location_name
      }));
    }
  }, [clientId, clientLocation, dispatch]);

  const initialValues = {
    id: isEditMode ? data.id : '',
    campaign_table_id: isEditMode ? data.campaign_table_id : '',
    client_id: isEditMode ? data.client_id : '',
    client_name: isEditMode ? data.client_name : '',
    client_location: isEditMode ? data.client_location : '',
    client_table_id: isEditMode ? data.client_table_id : '',
    campaign_name: isEditMode ? data.campaign_name : '',
    campaign_id: isEditMode ? data.campaign_id : '',
    campaign_status: isEditMode ? (data.campaign_status == 1 ? "Active" : "Deactive") : "",
    loyalty_card_id: isEditMode ? data.loyalty_card_id : loyaltyId,
    loyalty_card_name: isEditMode ? data.loyalty_card_name : '',
    number_of_stamps: isEditMode ? data.number_of_stamps : '',
    free_items: isEditMode ? data.free_items : '',
    expiration_time: isEditMode ? data.expiration_time : null,
    expiration_date: isEditMode && !data.no_expiration ? formatDate(data.expiration_date) : null,
    no_expiration: isEditMode ? data.no_expiration : false,
    free_item_logo: null,
  };

  const validationSchema = Yup.object({
    client_id: Yup.string().required("Client name is required"),
    client_table_id: Yup.string().required("Client location is required"),
    campaign_name: Yup.string().required("Campaign name is required"),
    loyalty_card_name: Yup.string().required("Loyalty card name is required"),
    number_of_stamps: Yup.number().required("Number of stamps is required"),
    free_items: Yup.string().required("Free item is required"),
    free_item_logo: !isEditMode && data?.free_item_logo == null ? Yup.mixed().required("Item Logo is required") : Yup.mixed().notRequired(),
    expiration_time: Yup.mixed().nullable().required("Expiration time is required"),
    expiration_date: Yup.string().nullable().test("no_expiration", "Expiration Date is required", function (value) {
      const { no_expiration } = this.parent;
      return no_expiration || Yup.string().required("Expiration Date is required").isValidSync(value);
    }),
  });

  const formatDateForSubmission = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}/${month}/${day}`;
  };

  const handleSubmit = (values) => {
    const formattedValues = new FormData(); 
  
    Object.keys(values).forEach(key => {
      if (key === 'free_item_logo' && values[key]) {
        formattedValues.append('free_item_logo', values[key]);
      } else if (key !== 'free_item_logo') {
        formattedValues.append(key, values[key]);
      }
    });
  
    formattedValues.append('campaign_status', values.campaign_status === "Active" ? "1" : "0");
    formattedValues.append('loyalty_card_id', loyalityUniqueId);
    formattedValues.append('expiration_date', values.no_expiration ? null : (values.expiration_date ? formatDateForSubmission(values.expiration_date) : null));
    // formattedValues.append('expiration_time', values.expiration_time ? formatTime(values.expiration_time) : null);
    formattedValues.append('no_expiration', values.no_expiration ? 1 : 0);
  
    // Dispatch the action
    if (isEditMode) {
      dispatch(editLoyality(formattedValues));
    } else {
      dispatch(createLoyality(formattedValues));
    }
    
  };
  
  return (
    <main>
      <div className="dashboard-wrap">
        <div className="back-and-heading-wrap">
          <div className="back-btn">
            <a style={{ cursor: "pointer" }} onClick={() => navigate("/loyalty-cards-management")} >
              <img src="/images/menu-icons/left-arrow.png" alt="" />
            </a>
          </div>
          <h1>{isEditMode ? "Edit Loyalty Card" : "Create Loyalty Card"}</h1>

          <div className="creat-new-user-wrap">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, setFieldValue, touched, errors }) => (
              <Form>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-3">
                      <label>
                        <h3>Client Name</h3>
                        <Field as="select" name="client_id"
                          onChange={(e) => {
                            const selectedClientId = e.target.value;
                            setClientId(selectedClientId);
                            const data = allClients.find( (item) => item.client_id == selectedClientId );
                            setFieldValue("client_id", selectedClientId);
                            setFieldValue("client_name", data?.client_name );
                          }} >
                          <option value="">Select client</option>
                            {client_loading && <option value="">Loading...</option>}
                            {allClients.length == 0 && <option value=""> No client Found</option>}

                            {allClients?.map((item) => (<option key={item.id} value={item.client_id}>
                            {item.client_name} - ({item.client_id})
                            </option>
                          ))}
                        </Field>
                      <ErrorMessage name="client_id" component="div" className="validation-error" />
                      </label>
                    </div>
                    <div className="col-lg-3">
                      <label>
                        <h3>Client Location</h3>
                        <Field as="select" name="client_table_id" 
                          onChange={(e) => {
                            const selectedLocationId = e.target.value;
                            const selectedLocation = allClientLocation?.find( (item) => item.client_table_id == 
                            selectedLocationId );
                            if (selectedLocation) {
                              setClientLocation(selectedLocation)
                              setFieldValue("client_location", selectedLocation?.location_name);
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
                            <option key={item.client_table_id} value={item.client_table_id} >
                              {item.location_name?.slice(0,25)} - ({item.client_table_id})
                            </option>
                          ))}
                        </Field>
                      <ErrorMessage name="client_table_id" component="div" className="validation-error" />
                      </label>
                    </div>
                    <div className="col-lg-3">
                      <label>
                        <h3>Campaign Name</h3>
                        <Field as="select" name="campaign_id" 
                          onChange={(e) => {
                            const selectedCampaignId = e.target.value;
                            const selectedCampaign = allCampaigns?.find((item) => item.campaign_id == selectedCampaignId );
                            setSelectedCampaign(selectedCampaign)
                            if (selectedCampaign) {
                              setFinalCampaignId(selectedCampaign?.campaign_id)
                              setFieldValue("campaign_name", selectedCampaign?.campaign_name);
                              setFieldValue("campaign_id", selectedCampaign?.campaign_id);
                              setFieldValue("campaign_table_id", selectedCampaign?.campaign_table_id );

                            } else {
                              setFinalCampaignId("")
                              setFieldValue("campaign_name", "");
                              setFieldValue("campaign_table_id", "");
                              setFieldValue("campaign_id", ""); 

                            }
                          }} >
                          <option value="">Select campaign</option>

                          {location_loading && <option value="">Loading...</option>}

                          {allCampaigns.length == 0 && <option value=""> No Campaign Found</option>}

                          {allCampaigns?.map((item) => (
                            <option key={item.campaign_id} value={item.campaign_id} >
                              {item.campaign_name} - ({item.campaign_id})
                            </option>
                          ))}
                        </Field>
                      <ErrorMessage name="campaign_name" component="div" className="validation-error" />
                      </label>
                    </div>
                    <div className="col-lg-3">
                      <label>
                        <h3>Campaign ID</h3>
                        <Field type="text" name="campaign_id" value={isEditMode ? values.campaign_id: finalCampaignId} placeholder="Enter campaign ID" disabled/>
                        <ErrorMessage name="campaign_id" component="div" className="validation-error" />
                      </label>
                    </div>
                    <div className="col-lg-3">
                      <label>
                        <h3>Campaign Status</h3>
                        <Field type="text" name="campaign_status" 
                          placeholder={selectedCampaign?.campaign_status == 1 ? "Active" : selectedCampaign?.campaign_status == 0 ? "Deactive" : "Select campaign name"} readOnly
                          style={{ backgroundColor: "rgb(217, 217, 217)", color: "#2A0181", fontWeight: "bold"}}
                        />
                      <ErrorMessage name="campaign_status" component="div" className="validation-error" />  
                      </label>
                    </div>
                    <div className="col-lg-3">
                      <label>
                        <h3>Loyalty Card ID</h3>
                        <Field type="text" name="loyalty_card_id" value={isEditMode? values.loyalty_card_id : loyaltyId} placeholder= "Enter coupon ID" disabled/>
                        <ErrorMessage name="loyalty_card_id" component="div" className="validation-error" />
                      </label>
                    </div>
                    <div className="col-lg-3">
                      <label>
                        <h3>Loyalty Card Name</h3>
                        <Field type="text" name="loyalty_card_name" placeholder="Enter coupon name" />
                        <ErrorMessage name="loyalty_card_name" component="div" className="validation-error" />
                      </label>
                    </div>

                    <div className="create-loyalty-box">
                      <div className="row">
                        <div className="col-lg-4">
                          <label>
                            <h3>Number of stamps</h3>
                            <Field type="text" name="number_of_stamps" placeholder="Enter number of stamps" />
                            <ErrorMessage name="number_of_stamps" component="div" className="validation-error" />
                          </label>
                        </div>
                        <div className="col-lg-4">
                          <label>
                            <h3>Free Item</h3>
                            <Field type="text" name="free_items" placeholder="Enter Free Item" />
                            <ErrorMessage name="free_items" component="div" className="validation-error" />
                          </label>
                        </div>
                        <div className="col-lg-4">
                          <div className="custom-file-upload2">
                            <label htmlFor="master_file"> Free item logo</label>
                            <input type="file" id="master_file"  name="free_item_logo"  style={{ display: "none" }}
                              accept="image/*"
                              onChange={(event) => {
                                const file = event.target.files[0];
                                setLogo(URL.createObjectURL(file));
                                setFieldValue("free_item_logo", file);
                              }}
                          />
                            <img src={ logo || "/images/menu-icons/company-uploadlogo.png"} className="upl_img"  style={{ width:'32px', height:"32px"}}/>
                          </div>
                          <ErrorMessage name="free_item_logo" component="div" className="validation-error" />
                        </div>

                        <div className="col-lg-4">
                          <label htmlFor="" className="start-end-date">
                            <h3>Expiration Time</h3>
                            <TimePicker format="HH:mm:ss"
                              placeholder="Expiration Time"
                              value={values.expiration_time ? moment(values.expiration_time, 'HH:mm:ss').toDate() : null} 
                              onChange={(time) => setFieldValue("expiration_time", formatTime(time))}
                            />
                          {touched.expiration_time && errors.expiration_time && (
                          <div className="validation-error">{errors.expiration_time}</div> )}
                          </label>
                        </div>
                        
                        <div className="col-lg-4">
                          <label htmlFor="" className="start-end-date">
                            <h3>Expiration Date</h3>
                            <DatePicker format="dd/MM/yyyy" oneTap placeholder="Enter expiration date" 
                              value={values.expiration_date ? new Date(values.expiration_date.split('/').reverse().join('/')) : null}
                              onChange={(date) => setFieldValue("expiration_date", formatDate(date))}
                              disabled={values.no_expiration}
                            />  
                            <img src="/images/menu-icons/calender-icon.png" alt="" />
                            {touched.expiration_date && errors.expiration_date && (
                          <div className="validation-error">{errors.expiration_date}</div> )}
                          </label>
                        </div>

                        <div className="col-lg-4">
                          <label htmlFor="" className="no-expariton-check">
                            <Field type="checkbox" name="no_expiration" 
                              onChange={(e) => {
                              const checked = e.target.checked;
                              setFieldValue("no_expiration", checked);
                              setFieldValue("expiration_date", checked ? null : values.expiration_date);
                            }}/>
                            <h3>No Expiration</h3>
                          </label>
                          {touched.expiration_date && errors.expiration_date && (<p className="validation-error"> </p> )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="big-modal-common-btns">
                  <button type="submit"><a style={{color:'white'}}> {isEditMode ? "Update" : "Save"}</a></button>
                </div>
              </Form>
            )}
            </Formik>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoyaltyCardForm;
