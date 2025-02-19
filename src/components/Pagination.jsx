import React, { useState, useEffect } from "react";

const Pagination = ({ data, itemsPerPageOptions, onPageDataChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [pageRange, setPageRange] = useState([]);
  const totalPages = Math.ceil(data?.length / (itemsPerPage === "all" ? data?.length : itemsPerPage));

  // Effect to update paginated data when currentPage, itemsPerPage, or data changes
  useEffect(() => {
    const start = (currentPage - 1) * (itemsPerPage === "all" ? data?.length : itemsPerPage);
    const end = start + (itemsPerPage === "all" ? data?.length : itemsPerPage);
    onPageDataChange(data?.slice(start, end));
  }, [currentPage, itemsPerPage, data, onPageDataChange]);

  // Effect to update page range when totalPages or itemsPerPage changes
  useEffect(() => {
    const maxVisiblePages = 6;
    const totalVisiblePages = Math.min(totalPages, maxVisiblePages);
    const newPageRange = Array.from({ length: totalVisiblePages }, (_, i) => i + 1);
    setPageRange(newPageRange);
  }, [totalPages, itemsPerPage]);

  // Reset to the first page when the data length becomes smaller than the items per page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [data, totalPages, currentPage]);

  const handleNext = () => {
    const lastPage = pageRange[pageRange.length - 1];
    if (lastPage < totalPages) {
      const nextRange = Array.from({ length: 6 }, (_, i) => lastPage + i + 1).filter((page) => page <= totalPages);
      setPageRange(nextRange);
      setCurrentPage(nextRange[0]);
    }
  };

  const handlePrev = () => {
    const firstPage = pageRange[0];
    if (firstPage > 1) {
      const prevRange = Array.from({ length: 6 }, (_, i) => firstPage - (i + 1)).filter((page) => page > 0);
      setPageRange(prevRange.reverse());
      setCurrentPage(prevRange[0]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    const newItemsPerPage = value === "all" ? data?.length : Number(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to the first page when items per page changes
    const newTotalPages = Math.ceil(data?.length / newItemsPerPage);
    const maxVisiblePages = Math.min(6, newTotalPages);
    setPageRange(Array.from({ length: maxVisiblePages }, (_, i) => i + 1));
  };

  return (
    <div className="influ-pagi">
      {
        totalPages !== 0 && 
        <ul>
          <li onClick={handlePrev} className={currentPage === 1 ? "disabled" : ""}>
            <a style={{ cursor: "pointer" }}>
              <i className="fas fa-chevron-left"></i>
            </a>
          </li>

          {pageRange.map((page) => (
            <li key={page} className={page === currentPage ? "active" : ""}>
              <a style={{ cursor: "pointer" }} onClick={() => handlePageChange(page)}>
                {page}
              </a>
            </li>
          ))}

          <li onClick={handleNext} className={currentPage === totalPages ? "disabled" : ""}>
            <a style={{ cursor: "pointer" }}>
              <i className="fas fa-chevron-right"></i>
            </a>
          </li>
        </ul>
      }
      <form>
        <div className="show-result-pagination-wp">
          <select name="itemsPerPage" onChange={(e) => handleRecordsPerPageChange(e.target.value)}>
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All" : `${option} per page`}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
};

export default Pagination;


// import React from "react";

// const Pagination = ({ currentPage, totalPages, pageRange, onPageChange, onPrev, onNext, onRecordsPerPageChange }) => {
//   return (
//     <div className="influ-pagi">
//       <ul>
//         <li onClick={onPrev} className={currentPage === 1 ? "disabled" : ""}>
//           <a href="#">
//             <i className="fas fa-chevron-left"></i>
//           </a>
//         </li>

//         {pageRange.map((page) => (
//           <li key={page} className={page === currentPage ? "active" : ""}>
//             <a href="#" onClick={() => onPageChange(page)}>
//               {page}
//             </a>
//           </li>
//         ))}

//         <li onClick={onNext} className={currentPage === totalPages ? "disabled" : ""}>
//           <a href="#">
//             <i className="fas fa-chevron-right"></i>
//           </a>
//         </li>
//       </ul>
//       <form>
//         <div className="show-result-pagination-wp">
//           <select name="itemsPerPage" onChange={(e) => onRecordsPerPageChange(e.target.value)}>
//             <option value="50">50 per page</option>
//             <option value="100">100 per page</option>
//             <option value="150">150 per page</option>
//             <option value="200">200 per page</option>
//             <option value="250">250 per page</option>
//             <option value="all">All pages</option>
//           </select>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Pagination;