// module.exports.isDateString = (value)=> {
//     switch (typeof value) {
//         case 'number':
//             return true;
//         case 'string':
//             return !isNaN(Date.parse(value));
//         case 'object':
//             if (value instanceof Date) {
//                 return !isNaN(value.getTime());
//             }
//         default:
//             return false;
//     }
// }

module.exports.isDateString = (dateString) => {
    // Check if the date string is in the valid format (YYYY-MM-DD)
    // const regex = /^\d{4}-\d{2}-\d{2}$/;
    // if (!regex.test(dateString)) {
    //   return false;
    // }
  
    // Convert the date string to a Date object
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return false;
    }
  
    // Check if the year, month, and day are within valid ranges
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
  
    if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
  
    // Additional checks for specific cases can be added here if needed
  
    return true;
  }
  