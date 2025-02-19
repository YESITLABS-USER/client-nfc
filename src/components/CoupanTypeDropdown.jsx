import React, { useState } from "react";

const CouponTypeDropdown = () => {
  const [selectedCouponType, setSelectedCouponType] = useState("");

  const handleCouponTypeChange = (e) => {
    setSelectedCouponType(e.target.value);
  };

  return (
    <div className="create-loyalty-box">
      <div>
        <div>
          <label style={{width:'30%'}}>
            <h6 style={styles.h6}>Coupon Type</h6>
            <select
              style={styles.select}
              value={selectedCouponType}
              onChange={handleCouponTypeChange}
            >
              <option value="">Select Coupon Type</option>
              <option value="freeItem">Free Item</option>
              <option value="freeItemWithPurchase">Free item with purchase</option>
              <option value="tieredDiscount">Tiered Discount</option>
              <option value="spendXGetY">Spend X Get Y Free</option>
              <option value="discountPercentage">Discount %</option>
              <option value="xForY">X for Y</option>
            </select>
          </label>

          {selectedCouponType === "freeItem" && (
            <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
              <label>
                <h6 style={styles.h6}>Free Item</h6>
                <input type="text" style={styles.input} placeholder="Enter free item" />
              </label>
            </div>
          )}

          {selectedCouponType === "freeItemWithPurchase" && (
            <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
              <label>
                <h6 style={styles.h6}>Purchase Item</h6>
                <input type="text" style={styles.input} placeholder="Enter purchase item" />
              </label>
              <label>
                <h6 style={styles.h6}>Free Item</h6>
                <input type="text" style={styles.input} placeholder="Enter free item" />
              </label>
            </div>
          )}

          {selectedCouponType === "tieredDiscount" && (
            <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
              <label>
                <h6 style={styles.h6}>Spending Value (€)</h6>
                <input type="text" style={styles.input} placeholder="Enter Spending Value" />
              </label>
              <label>
                <h6 style={styles.h6}>Numeric Discount Value</h6>
                <input type="text" style={styles.input} placeholder="Enter Numeric Discount" />
              </label>
              <label>
                <h6 style={styles.h6}>Discount Value (€/%)</h6>
                <input type="text" style={styles.input} placeholder="Enter Discount value" />
              </label>
              <label>
                <h6 style={styles.h6}>Product Restrictions</h6>
                <input type="text" style={styles.input} placeholder="Enter Restrictions Detail" />
              </label>
            </div>
          )}

          {selectedCouponType === "spendXGetY" && (
            <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
              <label>
                <h6 style={styles.h6}>Spend (€)</h6>
                <input type="text" style={styles.input} placeholder="Number of Spend" />
              </label>
              <label>
                <h6 style={styles.h6}>Free Item</h6>
                <input type="text" style={styles.input} placeholder="Enter Free Item" />
              </label>
            </div>
          )}

          {selectedCouponType === "discountPercentage" && (
            <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
              <label>
                <h6 style={styles.h6}>Discount %</h6>
                <input type="text" style={styles.input} placeholder="Discount %" />
              </label>
              <label>
                <h6 style={styles.h6}>Product Restrictions</h6>
                <input type="text" style={styles.input} placeholder="Enter Restrictions Detail" />
              </label>
            </div>
          )}

          {selectedCouponType === "xForY" && (
            <div style={{ display: "flex", gap: "10px", paddingTop: "20px" }}>
              <label>
                <h6 style={styles.h6}>X text</h6>
                <input type="text" style={styles.input} placeholder="Enter X text" />
              </label>
              <label>
                <h6 style={styles.h6}>Y text</h6>
                <input type="text" style={styles.input} placeholder="Enter Y text" />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
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
    select: {
      width: "100%",
      height: "36px",
      padding: "7px 9px",
      textAlign: "left",
      color: "#949494",
      position: "relative",
      fontSize: "14px",
      outline: "none",
      fontWeight: 400,
      border: "1px solid #D4D4D4",
      borderRadius: "10px",
      appearance: "none",
      background: "url(../images/menu-icons/select-dropdown.svg)",
      backgroundPosition: "center right 10px",
      backgroundSize: "auto",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#fff",
    },
    input: {
      width: "100%",
      height: "36px",
      padding: "7px 9px",
      textAlign: "left",
      color: "#444444",
      position: "relative",
      fontSize: "14px",
      outline: "none",
      fontWeight: 400,
      border: "1px solid #D4D4D4",
      borderRadius: "10px",
    },
  };

export default CouponTypeDropdown;
