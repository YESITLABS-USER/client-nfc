import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addClient, updateClient, getAllClientTemplates, createClientTemplate, getClientUniqueId, getLocationUniqueId } from "../redux/slices/clientSlice";
import * as Yup from 'yup';
import GooglePlacesAutocomplete from "../components/GooglePlacesAutocomplete";


const AddClient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyPhoto, setCompanyPhoto] = useState(null);

  const { templates,clientIdAndUrl, uniqueLocationId } = useSelector((state) => state.clients);
  const [currentData, setCurrentData] = useState([]);
  const location = useLocation();
  const [templateClientId, setTemplateClientId] = useState("");
  const { data } = location.state || {};
  const [dataId, setDataId] = useState(data?.id);
  const [uniqueId, setUniqueId] = useState(null)
  const [locationUniqueId, setLocationUniqueId] = useState(null)

  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
  const FILE_SIZE = 8 * 1024 * 1024; // 8 MB

  const validationSchema = Yup.object({
    client_name: Yup.string().required('Client Name is required'),
    client_id: Yup.string().required('Client ID is required'),
    business_id: Yup.string().required('Business ID is required'),
    industry: Yup.string().required('Industry is required'),
    website_address: Yup.string().required('Website Address is required'),
    facebook: Yup.string().required('Facebook URL is required'),
    instagam: Yup.string().required('Instagram URL is required'),
    youtube: Yup.string().required('YouTube URL is required'),
    company_logo: Yup.mixed().test("fileSize","File size is too large. Max size is 8 MB.",
        (value) => !value || (typeof value === "string") ||  (value && value.size <= FILE_SIZE) )
      .test("fileFormat","Unsupported file format. Please upload JPEG, JPG, or PNG.",
        (value) => !value || (typeof value === "string") || (value && SUPPORTED_FORMATS.includes(value.type))),
    company_photo: Yup.mixed().test("fileSize","File size is too large. Max size is 8 MB.",
        (value) => !value || (typeof value === "string") || (value && value.size <= FILE_SIZE) )
      .test("fileFormat", "Unsupported file format. Please upload JPEG, JPG, or PNG.", 
        (value) => !value || (typeof value === "string") || (value && SUPPORTED_FORMATS.includes(value.type)) 
    ),
    tiktok_link: Yup.string().required('TikTok URL is required'),
    twitter_link: Yup.string().required('Twitter URL is required'),
    company_slogam: Yup.string().required('Slogan is required'),
    business_about_us: Yup.string().required('About us is required').max(5000, 'About Us cannot exceed 5000 characters'),
    location_name: Yup.string().required('Location Name is required'),
    location_id: Yup.string().required('Location ID is required'),
    // location_address: Yup.string().required('Location Address is required'),
    phone_number: Yup.string().required('Phone Number is required'),
    city: Yup.string().required('City is required'),
    zip_code: Yup.string().required("Zipcode is required").matches(/^\d{5,6}$/, "Pincode must be 5 or 6 digits"), 
    email: Yup.string().email('Invalid email address').required('Email is required'),
    google_review_link: Yup.string().required('Google Review URL is required'),
    client_location_nfc_media_url: Yup.string().required('NFC Media URL is required'),
  });

  useEffect(() => {
    dispatch(getAllClientTemplates());
    dispatch(getClientUniqueId());
    dispatch(getLocationUniqueId());
  }, [dispatch]);

  useEffect(() => {
    if (templates) {
      setCurrentData(templates?.data);
    }
  }, [templates]);

  useEffect(() => {
    if (clientIdAndUrl) {
      setUniqueId(clientIdAndUrl?.client_id);
    }
  }, [clientIdAndUrl]);

  useEffect(() => {
    if (uniqueLocationId) {
      setLocationUniqueId(uniqueLocationId?.client_id);
    }
  }, [uniqueLocationId]);

  const initialValues = {
    id: data?.id || "",
    lang: "eng",
    client_name: data?.client_name || "",
    client_id: (data?.client_id ?? uniqueId) || "",
    business_id: data?.business_id || "",
    industry: data?.industry || "",
    website_address: data?.website_address || "",
    facebook: data?.facebook || "",
    instagam: data?.instagam || "",
    youtube: data?.youtube || "",
    tiktok_link: data?.tiktok_link || "",
    twitter_link: data?.twitter_link || "",
    company_logo: data?.company_logo || "",
    company_photo: data?.company_photo || "",
    company_slogam: data?.company_slogam || "",
    business_about_us: data?.business_about_us || "",
    location_name: data?.location_name || "",
    location_id: (data?.location_id ?? locationUniqueId) || "",
    // location_address: data?.location_address || "",
    phone_number: data?.phone_number || "",
    city: data?.city || "",
    zip_code: data?.zip_code || "",
    email: data?.email || "",
    google_review_link: data?.google_review_link || "",
    client_location_nfc_media_url: data?.client_location_nfc_media_url || "",
    opening_hours:
      Array.isArray(data?.opening_hours) && data?.opening_hours.length
        ? data?.opening_hours
        : [
          { day: "Monday", startTime: "", endTime: "", isClosed: 0 },
          { day: "Tuesday", startTime: "", endTime: "", isClosed: 0 },
          { day: "Wednesday", startTime: "", endTime: "", isClosed: 0 },
          { day: "Thursday", startTime: "", endTime: "", isClosed: 0 },
          { day: "Friday", startTime: "", endTime: "", isClosed: 0 },
          { day: "Saturday", startTime: "", endTime: "", isClosed: 0 },
          { day: "Sunday", startTime: "", endTime: "", isClosed: 0 },
        ],
  };

  // Utility to generate time options in AM/PM format
  const generateTimes = () => {
    const times = [
      "12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM",
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
      "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM" ];
    // const times = [];
    // for (let hour = 1; hour <= 12; hour++) {
    //   const formattedHour = String(hour).padStart(2, '0'); // Adds leading zero for single digit hours
    //   const amTime = `${formattedHour}:00 AM`;
    //   const pmTime = `${formattedHour}:00 PM`;
    //   times.push(amTime, pmTime);
    // }
    return times;
  };
  

  const handleSubmit = (processedValues) => {
    const values = {
      ...processedValues, opening_hours: processedValues.opening_hours.map((hour) => ({
        ...hour, isClosed: hour.isClosed ? 1 : 0,
      })),
    };
    
    if(templateClientId){
      values.template_id = values.id;
      delete values.id;
    } else {
      values.template_id = null;
    }

    dispatch(data?.id ? updateClient(values) : addClient(values))
  };

  const saveAsTemplate = (values) => {
    if(templateClientId){
      values.template_id = values.id;
      delete values.id;
    } else {
      values.template_id = null;
    }
    dispatch(createClientTemplate(values))
  };

  return (
    <main>
      <div className="dashboard-wrap">
        <div className="back-and-heading-wrap">
          <div className="back-btn">
            <a href="/client-management">
              <img src="/images/menu-icons/left-arrow.png" alt="" />
            </a>
          </div>
          {
            dataId ? (<h1>Update Client</h1>) : (<h1>Add New Client</h1>)
          }
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize={true}
            validationSchema={validationSchema}>
            {({ errors, touched, setFieldValue, values, setValues }) => (
              <Form>
                {!dataId && (<div className="select-template-box" style={{ position: "absolute", right: "20px" }}>
                  <Field
                    name="templateSelect"
                    as="select"
                    className="template-select"
                    value={templateClientId}
                    onChange={(e) => {
                      const selectedClientId = e.target.value;
                      setTemplateClientId(selectedClientId);

                      // Find the selected template from the templates list
                      const selectedTemplate = currentData.find(
                        (template) => template.client_id == selectedClientId
                      );
                      if (selectedTemplate) {
                        setValues({
                          ...values, 
                          ...selectedTemplate, 
                          client_id: selectedClientId, // Update client_id
                          location_id: locationUniqueId, // Update client_id
                        });
                      }
                    }}
                  >
                    <option value="">Select an option</option>
                    {currentData?.map((value, index) => (
                      <option key={index} value={value.client_id}>{value.client_name}-({value?.client_id})</option>
                    ))}
                  </Field>
                </div>)}
                <div className="creat-new-user-wrap">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-3">
                        <label>
                          <h3>Client Name</h3>
                          <Field
                            type="text"
                            name="client_name"
                            placeholder="Enter client Name" disabled={templateClientId}
                          />
                          {errors.client_name && touched.client_name && (
                            <div className="validation-error">{errors.client_name}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <label className="selected-id">
                          <h3>Client ID</h3>
                          <Field type="text" name="client_id" disabled />
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <label>
                          <h3>Business ID</h3>
                          <Field type="text" name="business_id" />
                          {errors.business_id && touched.business_id && (
                            <div className="validation-error">{errors.business_id}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <label>
                          <h3>Industry</h3>
                          <Field
                            type="text"
                            name="industry"
                            placeholder="Enter Industry"
                          />
                          {errors.industry && touched.industry && (
                            <div className="validation-error">{errors.industry}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <label>
                          <h3>Website Address</h3>
                          <Field
                            type="text"
                            name="website_address"
                            placeholder="Website URL"
                          />
                          {errors.website_address && touched.website_address && (
                            <div className="validation-error">{errors.website_address}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <label className="social-links">
                          <Field
                            type="text"
                            name="facebook"
                            placeholder="Paste Facebook Link"
                          />
                          <div className="social-icon-input">
                            <img
                              src="/images/menu-icons/facebook-icon.png"
                              alt=""
                            />
                          </div>
                          {errors.facebook && touched.facebook && (
                            <div className="validation-error">{errors.facebook}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <label className="social-links">
                          <Field
                            type="text"
                            name="instagam"
                            placeholder="Paste Instagram Link"
                          />
                          <div className="social-icon-input">
                            <img
                              src="/images/menu-icons/insta-icon.png"
                              alt=""
                            />
                          </div>
                          {errors.instagam && touched.instagam && (
                            <div className="validation-error">{errors.instagam}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <label className="social-links">
                          <Field
                            type="text"
                            name="youtube"
                            placeholder="Paste Youtube Link"
                          />
                          <div className="social-icon-input">
                            <img
                              src="/images/menu-icons/youtube-icon.png"
                              alt=""
                            />
                          </div>
                          {errors.youtube && touched.youtube && (
                            <div className="validation-error">{errors.youtube}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <div className="custom-file-upload2">
                          <label htmlFor="company_logo">Company Logo</label>
                          <input
                            type="file"
                            id="company_logo"
                            name="company_logo"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setCompanyLogo(URL.createObjectURL(file));
                              setFieldValue("company_logo", file);
                            }}
                            style={{ display: "none" }}
                          />
                          <img
                            src={companyLogo || "/images/menu-icons/company-uploadlogo.png"}
                            className="upl_img" style={{ width:'32px', height:"32px"}}
                          />
                          {errors.company_logo && touched.company_logo && (
                            <div className="validation-error">{errors.company_logo}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="custom-file-upload2">
                          <label htmlFor="company_photo">Company Photo</label>
                          <input
                            type="file"
                            id="company_photo"
                            name="company_photo"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setCompanyPhoto(URL.createObjectURL(file));
                              setFieldValue("company_photo", file);
                            }}
                            style={{ display: "none" }}
                          />
                          <img src={companyPhoto  || "/images/menu-icons/company-upload-icon.png"} 
                            className="upl_img"  style={{ width:'32px', height:"32px"}}
                          />
                          {errors.company_photo && touched.company_photo && (
                            <div className="validation-error">{errors.company_photo}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <label className="social-links mb-20">
                          <Field
                            type="text"
                            name="tiktok_link"
                            placeholder="Paste Tiktok Link"
                          />
                          <div className="social-icon-input">
                            <img
                              src="/images/menu-icons/tiktok-icon.png"
                              alt=""
                            />
                          </div>
                          {errors.tiktok_link && touched.tiktok_link && (
                            <div className="validation-error">{errors.tiktok_link}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <label className="social-links mb-20">
                          <Field
                            type="text"
                            name="twitter_link"
                            placeholder="Paste Twitter Link"
                          />
                          <div className="social-icon-input">
                            <img
                              src="/images/menu-icons/twitter-icon.png"
                              alt=""
                            />
                          </div>
                          {errors.twitter_link && touched.twitter_link && (
                            <div className="validation-error">{errors.twitter_link}</div>
                          )}
                        </label>
                      </div>
                      <div className="textarea-one-wrap">
                        <div className="left-textarea">
                          <div className="col-lg-12">
                            <label>
                              <h3>Company Slogan: (max. xx characters)</h3>
                              <Field
                                as="textarea"
                                name="company_slogam"
                                placeholder="Type"
                                className="company-slogan"
                              />
                              {errors.company_slogam && touched.company_slogam && (
                                <div className="validation-error">{errors.company_slogam}</div>
                              )}
                            </label>
                          </div>
                          <div className="col-lg-12">
                            <label>
                              <h3>Opening hours</h3>
                              <div className="opening-hours-box">
                                <div className="weektype-wrap">
                                  {/* <div className="col-lg-12"> */}
                                  <FieldArray
                                    name="opening_hours"
                                    render={({ push, remove, replace }) => (
                                      <div className="opening-hours-box">
                                        {values?.opening_hours?.map(
                                          (hour, index) => (
                                            <div
                                              key={index}
                                              className="weektype-wrap"
                                            >
                                              <h3 className="width-week">
                                                {hour.day}
                                              </h3>

                                              {/* Start Time Dropdown */}
                                              <Field
                                                name={`opening_hours[${index}].startTime`}
                                                as="select"
                                                className="week-select"
                                                value={hour.startTime || ""}
                                                disabled={hour.isClosed}
                                              >
                                                <option value="">
                                                  {/* Start Time */}
                                                  {hour.startTime}
                                                </option>
                                                {hour.isClosed ? (
                                                  <option value="">-</option>
                                                ) : (
                                                  generateTimes().map(
                                                    (time, idx) => (
                                                      <option
                                                        key={idx}
                                                        value={time}
                                                      >
                                                        {time}
                                                      </option>
                                                    )
                                                  )
                                                )}
                                              </Field>

                                              <span>-</span>

                                              {/* End Time Dropdown */}
                                              <Field
                                                name={`opening_hours[${index}].endTime`}
                                                as="select"
                                                className="week-select"
                                                value={hour.endTime || ""}
                                                disabled={hour.isClosed}
                                              >
                                                <option value="">
                                                  {/* End Time */}
                                                  {hour.endTime}
                                                </option>
                                                {hour.isClosed ? (
                                                  <option value="">-</option>
                                                ) : (
                                                  generateTimes().map(
                                                    (time, idx) => (
                                                      <option
                                                        key={idx}
                                                        value={time}
                                                      >
                                                        {time}
                                                      </option>
                                                    )
                                                  )
                                                )}
                                              </Field>

                                              {/* Closed Checkbox */}
                                              <Field
                                                name={`opening_hours[${index}].isClosed`}
                                                type="checkbox"
                                                checked={hour.isClosed}
                                                onChange={(e) => {
                                                  const isChecked = e.target.checked;
                                                  replace(index, {
                                                    ...hour,
                                                    isClosed: isChecked ? 1: 0,
                                                    startTime: isChecked ? "" : hour.startTime, 
                                                    endTime: isChecked ? "" : hour.endTime, 
                                                  });
                                                }}   
                                              />
                                              <h3>Closed</h3>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                  />
                                  {/* </div> */}
                                </div>
                              </div>
                            </label>
                          </div>

                        </div>
                        <div className="col-lg-6">
                          <label>
                            <h3>Business About us: (max. xx characters)</h3>
                            <Field
                              as="textarea"
                              name="business_about_us"
                              placeholder="Type"
                              className="business-aboutus"
                            />
                            {errors.business_about_us && touched.business_about_us && (
                              <div className="validation-error">{errors.business_about_us}</div>
                            )}
                          </label>
                        </div>
                      </div>
                      {/* <div className="col-lg-4 d-flex gap-2">
                        <label>
                          <h3>Client Location Name</h3>
                          <Field
                            type="text"
                            name="location_name"
                            placeholder="Type"
                          />
                          {errors.location_name && touched.location_name && (
                            <div className="validation-error">{errors.location_name}</div>
                          )}
                        </label>
                      </div> */}
                      <div className="col-lg-4 d-flex gap-2">
                        <label>
                          <h3>Client Location Name</h3>
                          <GooglePlacesAutocomplete onLocationSelect={(address) => setFieldValue("location_name", address)} edit={true} getAddress={values?.location_name || ""} />   

                          {errors.location_name && touched.location_name && (
                            <div className="validation-error">{errors.location_name}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-4">
                        <label>
                          <h3>Client Location ID</h3>
                          <Field
                            type="text"
                            name="location_id"
                            placeholder="Type" disabled
                          />
                          {errors.location_id && touched.location_id && (
                            <div className="validation-error">{errors.location_id}</div>
                          )}
                        </label>
                      </div>
                      {/* <div className="col-lg-4">
                        <label>
                          <h3>Location Address</h3>
                          <Field
                            type="text"
                            name="location_address"
                            placeholder="Type"
                          />
                          {errors.location_address && touched.location_address && (
                            <div className="validation-error">{errors.location_address}</div>
                          )}
                        </label>
                      </div> */}
                      <div className="col-lg-4">
                        <label>
                          <h3>Phone number</h3>
                          <Field
                            type="text"
                            name="phone_number"
                            placeholder="Type"
                          />
                          {errors.phone_number && touched.phone_number && (
                            <div className="validation-error">{errors.phone_number}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-4">
                        <label>
                          <h3>City</h3>
                          <Field type="text" name="city" placeholder="Type" />
                          {errors.city && touched.city && (
                            <div className="validation-error">{errors.city}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-4">
                        <label>
                          <h3>Zip Code</h3>
                          <Field
                            type="text"
                            name="zip_code"
                            placeholder="Type"
                          />
                          {errors.zip_code && touched.zip_code && (
                            <div className="validation-error">{errors.zip_code}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-4">
                        <label>
                          <h3>Email</h3>
                          <Field type="text" name="email" placeholder="Type" />
                          {errors.email && touched.email && (
                            <div className="validation-error">{errors.email}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-4">
                        <label>
                          <h3>Google Review URL</h3>
                          <Field
                            type="text"
                            name="google_review_link"
                            placeholder="Type"
                          />
                          {errors.google_review_link && touched.google_review_link && (
                            <div className="validation-error">{errors.google_review_link}</div>
                          )}
                        </label>
                      </div>
                      <div className="col-lg-4">
                        <label>
                          <h3>Client Location NFC Media URL</h3>
                          <Field
                            type="text"
                            name="client_location_nfc_media_url"
                            placeholder="Type"
                          />
                          {errors.client_location_nfc_media_url && touched.client_location_nfc_media_url && (
                            <div className="validation-error">{errors.client_location_nfc_media_url}</div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="big-modal-common-btns">
                    <button
                      type="submit"
                      style={{
                        borderRadius: "30px",
                        color: "#fff",
                        textAlign: "center",
                        padding: "10px 43px",
                        backgroundColor: "#2a0181",
                        fontSize: "15px",
                        width: "auto",
                        fontWeight: "400",
                        boxShadow: "0px 4px 4px 0px #00000040",
                      }}
                    >
                      {dataId ? "Update" : "Save"}
                    </button>
                    <button type="button" 
                      style={{ borderRadius: "30px", color: "#fff", textAlign: "center", padding: "10px 43px",
                        backgroundColor: "#a69020", fontSize: "15px", width: "auto", fontWeight: "400",
                        boxShadow: "0px 4px 4px 0px #00000040", }} onClick={() => saveAsTemplate(values)} >
                      
                       {templateClientId ? "Update Template" : "Save as template"}
                      
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
};

export default AddClient;
