import { useEffect, useRef, useState } from 'react';

const GooglePlacesAutocomplete = ({ onLocationSelect, edit, getAddress }) => {
  const inputRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const loadGoogleMapsScript = () => {
    if (window.google) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=AIzaSyC9NuN_f-wESHh3kihTvpbvdrmKlTQurxw&libraries=places`;
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => console.error("Error loading Google Maps script.");
    document.head.appendChild(script);
  };

  const initializeAutocomplete = () => {
    if (window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const address = place.formatted_address;
          onLocationSelect(address); // Pass the address to the parent component
        }
      });
    }
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (isScriptLoaded) {
      initializeAutocomplete();
    }
  }, [isScriptLoaded]);

  return (
    <div>
      <input
        ref={inputRef}
        id="address"
        type="text"
        placeholder={getAddress || "Enter address"}
        disabled={!edit}
      />
    </div>
  );
};

export default GooglePlacesAutocomplete;
