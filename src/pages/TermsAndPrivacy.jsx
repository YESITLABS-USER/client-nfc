import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { editTermsAndPrivacy, getTermsAndPrivacy } from '../redux/slices/TermsAndPrivacySlice';
import { useDispatch, useSelector } from 'react-redux';

const TabContent = ({ id, title, isActive, content, onSave }) => {
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

const TermsAndPrivacy = () => {
  // const [activeTab, setActiveTab] = useState("tc_text");
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab === 'tc_text' || savedTab === 'pp_text' ? savedTab : 'tc_text';
  });
  
  const [tabContents, setTabContents] = useState({});

  const dispatch = useDispatch();
  const { termsPrivacyData, loading, error } = useSelector((state) => state.termsAndPrivacy);

  useEffect(() => {
    dispatch(getTermsAndPrivacy());
  }, [dispatch]);
    useEffect(() => {
      if (termsPrivacyData) {
        const { tc_text, pp_text } = termsPrivacyData;
        setTabContents({
          tc_text: tc_text,
          pp_text:pp_text
        });
      }
    }, [termsPrivacyData]);

  const handleSaveContent = (id, updatedContent) => {
    const payload = { [id]: updatedContent };
    dispatch(editTermsAndPrivacy(payload))
    setTabContents((prevContents) => ({
      ...prevContents,
      [id]: updatedContent,
    }));
  };

  const handleTabClick = (id) => {
    console.log(id)
    setActiveTab(id);
    localStorage.setItem('activeTab', id); 
  };

  if (loading) {
    return <p style={{ minHeight:'80vh', display:'flex', justifyContent:'center', alignItems:'center', fontSize:"45px"}}>Loading...</p>;
  }

  if (error) {
    return <div style={{ minHeight:'80vh', display:'flex', justifyContent:'center', alignItems:'center', fontSize:"45px"}}>Error: {error.message}</div>;
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
                    className={`nav-link ${activeTab === "tc_text" ? "active" : ""}`}
                    id="tc_text-tab"
                    type="button"
                    role="tab"
                    onClick={() => {handleTabClick('tc_text')}}
                    aria-controls="tc_text"
                    aria-selected={activeTab === "tc_text"}
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "pp_text" ? "active" : ""}`}
                    id="pp_text-tab"
                    type="button"
                    role="tab"
                    onClick={() => {handleTabClick('pp_text')}}
                    aria-controls="pp_text"
                    aria-selected={activeTab === "pp_text"}
                  >
                    Privacy Policy
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
                title={key === "tc_text" ? "Terms & Conditions" : "Privacy Policy"}
                isActive={activeTab === key}
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

export default TermsAndPrivacy;
