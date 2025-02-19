import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { editAboutServices, getAboutServices } from '../redux/slices/aboutServicesSlice';

const TabContent = ({ id, isActive, content, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState(content);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditorContent(content);
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(id, editorContent);
  };

  return (
    <div className={`tab-pane fade ${isActive ? 'show active' : ''}`} id={id} role="tabpanel" aria-labelledby={`${id}-tab`}>
      <form>
        <div className="all-selected-aboutus">
          {isEditing ? (
            <ReactQuill theme="snow" value={editorContent} onChange={setEditorContent} />
          ) : (
            <div>
                {!editorContent?.trim() == "" ? (
                  <div dangerouslySetInnerHTML={{ __html: editorContent }} />
                ) : (
                  <p style={{ fontSize:'36px', fontWeight:'bold'}}>No data found</p>
                )}
              </div>
          )}
        </div>
        <div className="abouts-us-btnwrap">
          <button
            type="button"
            className="about-edit-btn"
            onClick={isEditing ? handleCancel : handleEdit}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            type="button"
            className="about-save-btn"
            onClick={handleSave}
            disabled={!isEditing}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

const AboutServices = () => {
  const dispatch = useDispatch();
  const { aboutServiceData, loading, error } = useSelector((state) => state.aboutServices);

  const [tabContents, setTabContents] = useState({});
  // const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'coupons_text'); // Set default active tab from localStorage
    const [activeTab, setActiveTab] = useState(() => {
      const savedTab = localStorage.getItem('activeTab');
      return savedTab === 'giveway_text' || savedTab === 'events_text' ? savedTab : 'coupons_text';
    });

  useEffect(() => {
    dispatch(getAboutServices());
  }, [dispatch]);

  useEffect(() => {
    if (aboutServiceData) {
      const { coupons_text, giveway_text, events_text } = aboutServiceData;
      setTabContents({
        coupons_text: coupons_text,
        giveway_text: giveway_text,
        events_text: events_text,
      });
    }
  }, [aboutServiceData]);

  const handleSaveContent = (id, updatedContent) => {
    const payload = { [id]: updatedContent };
    dispatch(editAboutServices(payload));
    setTabContents((prevContents) => ({
      ...prevContents,
      [id]: updatedContent,
    }));
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
    localStorage.setItem('activeTab', id); // Store the active tab in localStorage
  };

  if (loading) {
    return <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: "45px" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: "45px" }}>Error: {error.message}</div>;
  }

  return (
    <main>
      <div className="dashboard-wrap">
        <div className="common-inner-tabs-wrap">
          <div className="toptab-pill-wrap">
            <div className="tab-pill-border">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'coupons_text' ? 'active' : ''}`} 
                    id="coupons_text-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#coupons_text"
                    type="button"
                    role="tab"
                    aria-controls="coupons_text"
                    aria-selected={activeTab === 'coupons_text'}
                    onClick={() => handleTabClick('coupons_text')}
                  >
                    COUPONS
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'giveway_text' ? 'active' : ''}`}
                    id="giveway_text-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#giveway_text"
                    type="button"
                    role="tab"
                    aria-controls="giveway_text"
                    aria-selected={activeTab === 'giveway_text'}
                    onClick={() => handleTabClick('giveway_text')}
                  >
                    GIVE AWAYS
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'events_text' ? 'active' : ''}`}
                    id="events_text-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#events_text"
                    type="button"
                    role="tab"
                    aria-controls="events_text"
                    aria-selected={activeTab === 'events_text'}
                    onClick={() => handleTabClick('events_text')}
                  >
                    EVENTS
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="tab-content" id="myTabContent">
            {Object.keys(tabContents).map((key, index) => (
              <TabContent
                key={key}
                id={key}
                title={key.toUpperCase()}
                isActive={activeTab === key} // Check if the tab is active
                content={tabContents[key]}
                onSave={handleSaveContent}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutServices;
