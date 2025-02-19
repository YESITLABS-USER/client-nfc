const handleGlobalSearch = (value, data) => {
  const lowerCaseSearchText = value.toLowerCase();

  const filteredData = data.filter((item) => {
    return Object.values(item)
      .filter((value) => typeof value === "string" || typeof value === "number")
      .join(" ")
      .toLowerCase()
      .includes(lowerCaseSearchText);
  });

  return filteredData;
};

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const formatTime = (date) => {
  if (!date) return "";
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

function convertToYYYYMMDD(datetimeStr) {
  const date = new Date(datetimeStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

const formatUrl = (url) => {
  if (url?.startsWith('http://') || url?.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export { handleGlobalSearch, formatDate, formatTime, convertToYYYYMMDD, formatUrl };
