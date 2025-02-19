import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import Quill styles
import { useDispatch, useSelector } from "react-redux";
import { editAboutTagis, getAboutTagis } from "../redux/slices/aboutTagisSlice.js";

const AboutUs = () => {
  const dispatch = useDispatch();
  const { aboutUsData, loading, error } = useSelector((state) => state.aboutTagis);

  // Local state for editor content and editing modes
  const [editorContent, setEditorContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isContentChanged, setIsContentChanged] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    dispatch(getAboutTagis());
  }, [dispatch]);

  // Update local state when API data is loaded
  useEffect(() => {
    if (aboutUsData?.text) {
      setEditorContent(aboutUsData?.text);
    }
  }, [aboutUsData]);

  // Handle editor content change and detect modifications
  const handleChange = (value) => {
    setEditorContent(value);
    setIsContentChanged(value !== aboutUsData.text); // Compare with fetched data
  };

  // Toggle edit/save mode
  const toggleEditMode = () => {
    if (isEditing && isContentChanged) {
      dispatch(editAboutTagis({"text" : editorContent}));
      setIsEditing(false);
      setIsContentChanged(false); // Reset change flag after saving
    } else {
      setIsEditing(!isEditing); // Toggle between edit and view modes
    }
  };

  // Cancel editing and reset content
  const cancelEdit = () => {
    setEditorContent(aboutUsData.text); // Reset to original content
    setIsContentChanged(false);
    setIsEditing(false);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["bold", "italic"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  if (loading) {
    return <p style={{ minHeight:'80vh', display:'flex', justifyContent:'center', alignItems:'center', fontSize:"45px"}}>Loading...</p>; // Handle loading state
  }
  if (error) {
    return <p style={{ minHeight:'80vh', display:'flex', justifyContent:'center', alignItems:'center', fontSize:"45px"}}>{error.message}</p>; // Handle loading state
  }

  return (
    <main>
      <div className="dashboard-wrap">
        <form>
          <div className="aboutus-tagis-wrap">
            {isEditing ? (
              <ReactQuill
                value={editorContent}
                onChange={handleChange}
                modules={modules}
              />
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
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="about-edit-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="about-save-btn"
                  onClick={toggleEditMode}
                  disabled={!isContentChanged}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                  <button type="button" className="about-edit-btn" onClick={toggleEditMode} >
                    Edit
                  </button>
                  <button type="button" className="about-save-btn" onClick={toggleEditMode} disabled={!isContentChanged} >
                    Save
                  </button>
                </>
            )}
          </div>
        </form>
      </div>
    </main>
  );
};

export default AboutUs;
