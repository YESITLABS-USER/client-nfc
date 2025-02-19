import React, { useState } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const CustomDateRangePicker = ({ onApply, onCancel }) => {
    const [value, setValue] = useState(null);

    const handleApply = (selectedValue) => {
        setValue(selectedValue);
        if (onApply && selectedValue) {
            onApply(selectedValue); // Apply selected range
        } else {
            // When there's no selection, call onCancel to reset the data
            onCancel && onCancel();
        }
    };

    return (
        <DateRangePicker
            value={value}
            onChange={handleApply}
            showHeader={false}
            placeholder="Date Range"
            onClean={() => { // This is triggered when the user cancels/cleans the date range.
                setValue(null); // Reset local state
                onCancel && onCancel(); // Notify parent that the filter should be cleared
            }}
        />
    );
};

export default CustomDateRangePicker;
