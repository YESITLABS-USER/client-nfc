import React, { useEffect, useState } from "react";
import { DatePicker } from "rsuite";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCampaignLoyality, getAllClients, getAllLocations, getLoyalityUniqueId } from "../redux/slices/loyalitySlice";
import { createCoupan, editCoupan } from "../redux/slices/coupanSlice";
import { convertToYYYYMMDD } from "../assets/common";


const CreateEditCoupan = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const isEditMode = data !== undefined;

  const dispatch = useDispatch();
  const { allClients, allClientLocation, loyalityUniqueId, allCampaigns, client_loading, location_loading } = useSelector((state) => state.loyality);
  
  const [loyaltyId, setLoyaltyId] = useState("");
  
  const [clientId, setClientId] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [finalCampaignId, setFinalCampaignId] = useState("");
  const [scanType, setScanType] = useState(isEditMode ? data?.validity_start_date_from_valid_scan : 0);
  const [selectColor, setSelectColor] = useState('#000000')
  const [selectedCouponType, setSelectedCouponType] = useState("");
  const [usageLimit, setUsageLimit] = useState(isEditMode ? data?.usages_limit_no_limit == 1 ? 1 : 0 : 0);
  const [isInfinity, setIsInfinity] = useState(false);

  useEffect(() => {
    dispatch(getAllClients());
    dispatch(getLoyalityUniqueId());

    if (isEditMode) {
      setClientId(data?.client_id);
      setSelectedCouponType(data?.coupon_type)
      setClientLocation({ client_location: data?.location_name, location_id: data?.location_id });
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

  const handleTextChange = (e) => {
    const colorCode = e.target.value;
    if(/^#[0-9A-F]{6}$/i.test(colorCode) || colorCode === '') {
      setSelectColor(colorCode); // Valid hex or empty input
      setFieldValue("color_selection", colorCode);
    }
  };
 
  const initialValues = {
    id: isEditMode ? data.id : "",
    client_id: isEditMode ? data.client_id : '',
    client_name: isEditMode ? data.client_name : '',
    client_location: isEditMode ? data.client_location : '',
    client_table_id: isEditMode ? data.client_table_id : '',
    campaign_name: isEditMode ? data.campaign_name : '',
    campaign_id: isEditMode ? data.campaign_id : '',
    status: isEditMode ? (data.status == 1 ? 1 : 0) : 1,
    campaign_table_id: isEditMode ? data.campaign_table_id : "",

    coupon_name:  isEditMode ? data?.coupon_name :"",
    coupon_id: isEditMode ? data?.coupon_id : loyaltyId || "", // Update this line

    coupon_type:  isEditMode ? data?.coupon_type : "",
    coupon_type_content: isEditMode ? data?.coupon_type_content : [],

    usages_limit_no_limit:  isEditMode ? data?.usages_limit_no_limit == 1 ? 1 : 0 : usageLimit ? 1 : 0,
    usages_limit_select_number: isEditMode ? data.usages_limit_select_number : "",
    usages_limit_select_time_unit: isEditMode ? data.usages_limit_select_time_unit : "",

    validity_start_date_from_valid_scan: isEditMode ? data.validity_start_date_from_valid_scan : 0,
    validity_select_number: isEditMode ? data.validity_select_number : "",
    validity_select_time_unit: isEditMode ? data.validity_select_time_unit : "",

    validity_start_date: isEditMode ? data.validity_start_date : "",
    validity_expiration_date: isEditMode ? data.validity_expiration_date : "",
    validity_no_limit: isEditMode ? data.validity_no_limit ? 1 : 0 : 0,
    other_customization: isEditMode ? data.other_customization : "" ,
    color_selection: isEditMode ? data.color_selection : "#000000",
    is_publish : isEditMode ? data.is_publish : 0,

    infinity_qty: isEditMode ? data?.infinity_qty == 1 ? 1 : 0 : 0,
    valid_scan_freq: isEditMode ? data?.valid_scan_freq : "",
    select_time_unit: isEditMode ? data?.select_time_unit : "",
    valid_scan_qty: isEditMode ? data?.valid_scan_qty : "",
  };
  
  const validationSchema = Yup.object({
    client_id: Yup.string().required("Client name is required"),
    client_table_id: Yup.string().required("Client location is required"),
    campaign_name: Yup.string().required("Campaign name is required"),
    status: Yup.string().required("Campaign status is required"),
    coupon_name: Yup.string().required("Coupon name is required"),
    coupon_type: !selectedCouponType ? Yup.string().required("Coupon type is required") : Yup.string().notRequired(),
    
    usages_limit_select_number: usageLimit ? Yup.string().notRequired() : Yup.string().required("Usage number is required"),
    usages_limit_select_time_unit: usageLimit ? Yup.string().notRequired() : Yup.string().required("Usage time unit is required"),
    validity_start_date_from_valid_scan:  Yup.string().required("Valid date type is required"),

    other_customization: Yup.string().required("Other customization is required"),

    valid_scan_freq : Yup.number().required("frequency is required"),
    select_time_unit: Yup.string().required("Time unit is required"),
    valid_scan_qty: Yup.number().required("scan quantity is required"),

  });


  const handleSubmit = (values) => {
    const formData = { ...values };

    if(formData.infinity_qty == 1){
      formData.validity_select_number = "";
      formData.validity_select_time_unit = "";
      formData.validity_start_date_from_valid_scan = 0;
      formData.validity_start_date = "";
      formData.validity_expiration_date = "";
      formData.validity_no_limit = 0;
    }

    if(scanType == 0) {
      formData.validity_select_number = "";
      formData.validity_select_time_unit = "";
    }
  
    if (usageLimit == 1) {
      formData.usages_limit_select_number = "";
      formData.usages_limit_select_time_unit = "";
    }
  
    // Clear expiration date if no limit is checked
    if (formData.validity_no_limit) {
      formData.validity_expiration_date = "";
    }
  
    // Add the logic to set coupon_id (if needed)
    if (!formData.coupon_id && loyaltyId) {
      formData.coupon_id = loyaltyId; // or loyalityUniqueId if that is preferred
    }
  
    // Dispatch the action to create or edit the coupon
    isEditMode ? dispatch(editCoupan(formData)) : dispatch(createCoupan(formData));
  
    console.log("Form Values:", formData);
  };
  
    
  return (
    <main>
      <div className="dashboard-wrap">
        <div className="back-and-heading-wrap">
          <div className="back-btn">
            <a href="/coupons-management">
              <img src="/images/menu-icons/left-arrow.png" alt="" />
            </a>
          </div>
          <h1>{isEditMode ? "Edit Coupan" : "Create Coupon"}</h1>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, setFieldValue, touched, errors }) => {
              const handleCouponTypeChange = (e) => {
                const type = e.target.value;
                setSelectedCouponType(type);
                // Reset coupon_type_content when type changes
                setFieldValue("coupon_type", type);
                setFieldValue("coupon_type_content", []);
              };  
            return(
            <Form >
              <div className="creat-new-user-wrap">
                <div className="col-lg-12">
                <div className="row">

              {/* Client Name */}    
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
              
              {/* Client Location */}
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
                      {item.location_name.slice(0,25)} - ({item.client_table_id})
                    </option>
                    ))}
                  </Field>
                  <ErrorMessage name="client_table_id" component="div" className="validation-error" />
                  </label>
                </div>

              {/* Campaign Name */}
                <div className="col-lg-3">
                  <label>
                    <h3>Campaign Name</h3>
                    <Field as="select" name="campaign_id" 
                      onChange={(e) => {
                      const selectedCampaignId = e.target.value;
                      const selectedCampaign = allCampaigns?.find((item) => item.campaign_id == selectedCampaignId );
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

              {/* Coupan ID */}
                <div className="col-lg-3">
                  <label>
                    <h3>Campaign ID</h3>
                    <Field type="text" name="campaign_id" value={isEditMode ? values.campaign_id: finalCampaignId} placeholder="Enter campaign ID" disabled/>
                    <ErrorMessage name="campaign_id" component="div" className="validation-error" />
                  </label>
                </div>
              
              {/* Coupan Status */}
                <div className="col-lg-3">
                  <label>
                    <h3>Campaign Status</h3>
                    <Field type="text" name="status" value={values?.status == 1 ? "Active" : "Deactive"} placeholder={values?.status == 1 ? "Active" : "De Active"} disabled/>
                    <ErrorMessage name="status" component="div" className="validation-error" />  
                  </label>
                </div>
              
              {/* Coupan ID */}
                <div className="col-lg-3">
                <label>
                  <h3>Coupon ID</h3>
                  <Field 
                    type="text" 
                    name="coupon_id" 
                    value={isEditMode ? values.coupon_id : loyaltyId || ""}
                    placeholder="Enter coupon ID"
                    disabled={true} 
                  />
                  <ErrorMessage name="coupon_id" component="div" className="validation-error" />
                </label>
                </div>
              {/* Coupan Name */}
                <div className="col-lg-3">
                  <label>
                    <h3>Coupon Name</h3>
                    <Field type="text" name="coupon_name" placeholder="Enter coupon name" />
                    <ErrorMessage name="coupon_name" component="div" className="validation-error" />
                  </label>
                </div>
              </div>


              <div className="create-loyalty-box">
                <div>
                  <div>
                    <label style={{width:'30%'}}>
                      <h6 style={styles.h6}>Coupon Type</h6>

                      <Field as="select" name="coupon_type"
                        style={styles.select}
                        value={selectedCouponType}
                        onChange={handleCouponTypeChange}
                        onBlur={() => setFieldValue("coupon_type", selectedCouponType)}
                      >
                        <option value="">Select Coupon Type</option>
                        <option value="freeItem">Free Item</option>
                        <option value="freeItemWithPurchase">Free item with purchase</option>
                        <option value="tieredDiscount">Tiered Discount</option>
                        <option value="spendXGetY">Spend X Get Y Free</option>
                        <option value="discountPercentage">Discount %</option>
                        <option value="xForY">X for Y</option>
                      </Field>
                      <ErrorMessage name="coupon_type" component="div" className="validation-error" />
                    </label>


                    {selectedCouponType == "freeItem" && (
                      <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
                        <label>
                          <h6 style={styles.h6}>Free Item</h6>
                          <input 
                            type="text" 
                            name="free_item" 
                            style={styles.input} 
                            placeholder="Enter free item" 
                            value={values.coupon_type_content[0]?.free_item || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              free_item: e.target.value
                            }])}
                          />
                        </label>
                      </div>
                    )}

                    {selectedCouponType == "freeItemWithPurchase" && (
                      <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
                        <label>
                          <h6 style={styles.h6}>Purchase Item</h6>
                          <input 
                            type="text" 
                            name="purchase_item"
                            value={values.coupon_type_content[0]?.purchase_item || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              purchase_item: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Enter purchase item" 
                          />
                        </label>
                        <label>
                          <h6 style={styles.h6}>Free Item</h6>
                          <input 
                            type="text" 
                            name="free_item"
                            value={values.coupon_type_content[0]?.free_item || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              free_item: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Enter free item" 
                          />
                        </label>
                      </div>
                    )}

                    {selectedCouponType == "tieredDiscount" && (
                      <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
                        <label>
                          <h6 style={styles.h6}>Spending Value (€)</h6>
                          <input 
                            type="text" 
                            name="spending_value"
                            value={values.coupon_type_content[0]?.spending_value || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              spending_value: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Enter Spending Value" 
                          />
                        </label>
                        
                        <label>
                          <h6 style={styles.h6}>Numeric Discount Value</h6>
                          <input 
                            type="text" 
                            name="numeric_discount_value"
                            value={values.coupon_type_content[0]?.numeric_discount_value || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              numeric_discount_value: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Enter Numeric Discount" 
                          />
                        </label>
                        <label>
                          <h6 style={styles.h6}>Discount Value (%)</h6>
                          <input 
                            type="text" 
                            name="discount_value"
                            value={values.coupon_type_content[0]?.discount_value || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              discount_value: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Enter Discount Value" 
                          />
                        </label>
                        <label>
                          <h6 style={styles.h6}>Product Restrictions</h6>
                          <input 
                            type="text" 
                            name="product_restrictions"
                            value={values.coupon_type_content[0]?.product_restrictions || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              product_restrictions: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Enter Product Restrictions" 
                          />
                        </label>
                      </div>
                    )}

                    {selectedCouponType == "spendXGetY" && (
                      <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
                        <label>
                          <h6 style={styles.h6}>Spend (€)</h6>
                          <input 
                            type="text" 
                            name="spend_value"
                            value={values.coupon_type_content[0]?.spend_value || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              spend_value: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Number of Spend" 
                          />
                        </label>
                        <label>
                          <h6 style={styles.h6}>Free Item</h6>
                          <input 
                            type="text" 
                            name="free_item"
                            value={values.coupon_type_content[0]?.free_item || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              free_item: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Enter Free Item" 
                          />
                        </label>
                      </div>
                    )}

                    {selectedCouponType == "discountPercentage" && (
                      <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
                        <label>
                          <h6 style={styles.h6}>Discount %</h6>
                          <input 
                            type="text" 
                            name="discount_percentage"
                            value={values.coupon_type_content[0]?.discount_percentage || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              discount_percentage: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Discount %" 
                          />
                        </label>
                        <label>
                          <h6 style={styles.h6}>Product Restrictions</h6>
                          <input 
                            type="text" 
                            name="product_restrictions"
                            value={values.coupon_type_content[0]?.product_restrictions || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              product_restrictions: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Enter Restrictions Detail" 
                          />
                        </label>
                      </div>
                    )}

                    {selectedCouponType == "xForY" && (
                      <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
                        <label>
                          <h6 style={styles.h6}>X text</h6>
                          <input 
                            type="text" 
                            name="x_text"
                            value={values.coupon_type_content[0]?.x_text || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              x_text: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Enter X text" 
                          />
                        </label>
                        <label>
                          <h6 style={styles.h6}>Y text</h6>
                          <input 
                            type="text" 
                            name="y_text"
                            value={values.coupon_type_content[0]?.y_text || ''} 
                            onChange={(e) => setFieldValue("coupon_type_content", [{
                              ...values.coupon_type_content[0],
                              y_text: e.target.value
                            }])}
                            style={styles.input} 
                            placeholder="Enter Y text" 
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage Limit */}
              <div className="bottom-coupon-form-wrap">
                <div className="row">
                  <div className="usagelimit-access">
                    <div className="col-lg-2">
                      <label className="no-expariton-check">
                        <h3>Usage Limit:</h3>
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label className="no-expariton-check">
                        <input 
                          type="checkbox"
                          name="usages_limit_no_limit"
                          checked={usageLimit ? 1 : 0}
                          onChange={(e) => {setUsageLimit(e.target.checked); setFieldValue("usages_limit_no_limit", e.target.checked ? 1 : 0)}}
                        />

                        <h3>No limit</h3>
                      </label>
                    </div>
                    <div className="col-lg-3">
                      <label>
                        <h3>Enter Number</h3>
                        <Field type="text" name="usages_limit_select_number" value={usageLimit ? "" : values.usages_limit_select_number} placeholder="Enter Number" disabled={usageLimit}/>
                        <ErrorMessage name="usages_limit_select_number" component="div" className="validation-error" />
                      </label>
                    </div>

                    <div className="col-lg-3">
                      <label>
                        <h3>Select Time Unit</h3>
                        <Field as="select" name="usages_limit_select_time_unit" disabled={usageLimit}>
                          <option value=""> Select Time Unit</option>
                          <option value="month"> Month </option>
                          <option value="day"> Days </option>
                          <option value="hour"> Hours </option>
                          <option value="minute"> Minutes </option>
                        </Field>
                        <ErrorMessage name="usages_limit_select_time_unit" component="div" className="validation-error" />
                      </label>
                    </div>
                  </div>

                </div>
              </div>

            {/* Frequency */}
              <div className="row" style={{ paddingTop:"40px"}}>
                <div className="col-lg-3">
                  <label>
                    <h3>Valid Scan Frequency</h3>
                    <Field type="text" name="valid_scan_freq" />
                    <ErrorMessage name="valid_scan_freq" component="div" className="error-message d-flex"
                      style={{ color: "red", fontSize: "12px", paddingLeft: "10px", }}
                    />
                  </label>
                </div>
  
                <div className="col-lg-3">
                  <label>
                  <h3>Select Time Unit</h3>
                  <Field as="select" name="select_time_unit" onChange={(e) => {
                    setFieldValue('select_time_unit', e.target.value);
                    }}>
                    <option value=""> Select Time Unit </option>
                    <option value="1">Month</option>
                    <option value="2">Day</option>
                    <option value="3">Hour</option>
                    <option value="4">Minute</option>
                  </Field>
                  <ErrorMessage name="select_time_unit" component="div" className="error-message d-flex"
                    style={{ color: "red", fontSize: "12px", paddingLeft: "10px", }}
                  />
                  </label>
                </div>
  
                <div className="col-lg-3">
                  <label>
                    <h3>Valid Scan Qty</h3>
                    <Field type="text" name="valid_scan_qty"/>
                    <ErrorMessage name="valid_scan_qty" component="div" className="error-message d-flex"
                      style={{ color: "red", fontSize: "12px", paddingLeft: "10px", }}
                    />
                  </label>
                </div>

                <div className="col-lg-3">
                  <label className="no-expariton-check">
                    <Field type="checkbox" name="infinity_qty" checked={isInfinity} 
                      onChange={(e)=> {
                      setScanType(isInfinity ? 1 : 0);
                      setIsInfinity(!isInfinity);
                      setFieldValue("infinity_qty", e.target.checked ? 1 : 0);
                    }} />
                    <h3>Infinity</h3>
                  </label>
                </div>
              </div>

            {/* Valid Scan or GAP*/}
              <div className="bottom-coupon-form-wrap">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="usagelimit-access">
                      <div className="col-lg-3">
                        <label className="no-expariton-check">
                          <Field
                            type="checkbox"
                            name="validity_start_date_from_valid_scan"
                            value={scanType}
                            disabled={isInfinity}  // Disable based on isInfinity state
                            checked={scanType === 1}  // Corrected comparison
                            onChange={() => {
                              setScanType(scanType === 1 ? 0 : 1)
                              setFieldValue("validity_start_date_from_valid_scan", scanType === 1 ? 0 : 1);
                            }}  // Toggle scanType between 0 and 1
                          />
                          <h3>Start date from valid scan</h3>
                        </label>
                      </div>

                      <div className="col-lg-3">
                        <label>
                          <h3>Select Number</h3>
                          <Field
                            type="text"
                            name="validity_select_number"
                            placeholder="Enter Number"
                            disabled={scanType !== 1 || isInfinity}
                            value={scanType === 1 ? values.validity_select_number : ""}
                          />
                        </label>
                      </div>

                      <div className="col-lg-3">
                        <label>
                          <h3>Select Time Unit</h3>
                          <Field
                            as="select"
                            name="validity_select_time_unit"
                            disabled={scanType !== 1 || isInfinity}
                            value={scanType === 1 ? values.validity_select_time_unit : ""}
                          >
                            <option value="">Select Time Unit</option>
                            <option value="month">Month</option>
                            <option value="day">Days</option>
                            <option value="hour">Hours</option>
                            <option value="minute">Minutes</option>
                          </Field>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Start End Date */}
              <div className="bottom-coupon-form-wrap">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="usagelimit-access">
                      <label className="no-expariton-check">
                        
                        <div className="col-lg-3">
                          <label className="start-end-date">
                            <h3>Start Date</h3>
                            <DatePicker 
                              format="dd/MM/yyyy" 
                              oneTap 
                              placeholder="Enter start date"
                              disabled={isInfinity}
                              onChange={(date) => setFieldValue("validity_start_date", convertToYYYYMMDD(date))}
                              value={values?.validity_start_date ? new Date(values?.validity_start_date) : null}
                            />  
                            <img src="/images/menu-icons/calender-icon.png" alt="" />

                          </label>
                        </div>
                        <div className="col-lg-3">
                          <label className="start-end-date">
                            <h3>Expiration Date</h3>
                            <DatePicker 
                              format="dd/MM/yyyy" 
                              oneTap 
                              placeholder="Enter expiration date"
                              disabled={values.validity_no_limit || isInfinity}
                              onChange={(date) => setFieldValue("validity_expiration_date", convertToYYYYMMDD(date))}
                              value={values.validity_expiration_date ? new Date(values.validity_expiration_date) : null}
                            />  
                            <img src="/images/menu-icons/calender-icon.png" alt="" />
                          </label>
                        </div>
                        <div className="col-lg-4">
                          <label className="no-expariton-check" style={{marginLeft: "20px"}}>
                            <Field
                              type="checkbox"
                              name="validity_no_limit"
                              disabled={isInfinity}
                              onChange={(e) => {
                                setFieldValue("validity_no_limit", e.target.checked ? 1 : 0);
                              }}
                            />
                            <h3>No limit</h3>
                          </label>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bottom-coupon-form-wrap">
                <div className="col-lg-12">
                  <div className="row">
                    <div
                      className="usagelimit-access"
                      style={{alignItems: "flex-start"}}
                    >
                      <div className="col-lg-6">
                        <label>
                          <h3>Other customization</h3>
                        <Field type="textarea" name="other_customization" placeholder="Enter other customisations " />
                        <ErrorMessage name="other_customization" component="div" className="validation-error" />
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <label>
                          <h3>Color selection</h3>
                          <div style={{display:'flex', alignItems:'center',position:"relative" }}>
                            <Field 
                              type="text" 
                              name="color_selection" 
                              value={selectColor} 
                              placeholder="000000" 
                              onChange={handleTextChange} 
                              style={{paddingRight:'40px'}}
                            />
                            <input 
                              type="color" 
                              value={selectColor} 
                              style={{position:'absolute', right:'5px', width:"30px", borderRadius:'5px', border:'none'}} 
                              onChange={(e) => {
                                const newColor = e.target.value;
                                setSelectColor(newColor);
                                setFieldValue("color_selection", newColor);
                              }}
                            />
                          </div>
                        </label>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="big-modal-common-btns">
              <button
                type="submit"
                style={{ backgroundColor: "transparent", color: "white" }}
                onClick={() => setFieldValue("is_publish", 0)}
                // onClick={() => handleSubmit(values, false)}
                >
                <a>{isEditMode ? "Update" : "Save"}</a>
              </button>

              {!isEditMode && (
                <button
                type="submit"
                  style={{ backgroundColor: "transparent", color: "white" }}
                  onClick={() => setFieldValue("is_publish", 1)}
                  // onClick={() => handleSubmit(values, true)} // Pass true to indicate "Publish"
                >
                  <a className="publish-btn">Publish</a>
                </button>
              )}
            </div>
          </div>
          </Form>
          )}}
          </Formik>
        </div>
      </div>

    </main>
  );
};

const styles = {
  h6: {
    color: "#000",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
    textAlign: "left",
    marginBottom: "4px",
  },
};
export default CreateEditCoupan;
