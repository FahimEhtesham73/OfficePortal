import { toast } from "react-toastify";

export const profileImg = (imgPath) => {
    if(imgPath){
        const pathArray = imgPath.split("/");
        const lastTwo = `${pathArray[pathArray.length-2]}/${pathArray[pathArray.length-1]}`
        return process.env.REACT_APP_IMGLOCATION + lastTwo;
    }else{
        return ""
    }
}


export const totalHolidays = (startDate, endDate) => {
    if(new Date(startDate) < new Date(endDate)){
         endDate = new Date(endDate).setHours(23,59,59,999)
         startDate = new Date(new Date(startDate).setHours(0,0,0,0));
        let count = 0;
        while (startDate <= endDate) {
            const dayOfWeek = startDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 represents Sunday, 6 represents Saturday
              count++;
            }
            startDate.setDate(startDate.getDate() + 1);
        
          }
          return count
    }else{
        return 0
    }
}

export const totalHolidaysCustomize = (startDate, endDate, customHolidays = []) => {
  if (new Date(startDate) < new Date(endDate)) {
    endDate = new Date(endDate).setHours(23, 59, 59, 999);
    startDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
    let count = 0;
    while (startDate <= endDate) {
      const dayOfWeek = startDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 represents Sunday, 6 represents Saturday
        count++;
      } else if (customHolidays.includes(startDate.toISOString().split('T')[0])) {
        count++;
      }

      startDate.setDate(startDate.getDate() + 1);
    }

    return count;
  } else {
    return 0;
  }
};


export const taskDataPrepration = (data) => 
{

  let tempData = data?.reduce((acc, curr) => {
    // Check if the _id is already present in the accumulator array
    if (!acc.some((item) => item._id === curr._id)) {
      // If not present, add the current object to the accumulator array
      acc.push(curr);
    }
    return acc;
  }, []);

   const columns = [
        {
          id: 1,
          title: "Todo",
          cards: [
            
          ],
        },
        {
          id: 2,
          title: "In Progress",
          cards: [
            
          ],
        },
        {
          id: 3,
          title: "Pause",
          cards: [
            
          ],
        },
        {
          id: 4,
          title: "Done",
          cards: [
            
          ],
        },
      ]
      if(tempData.length){
        for(let item of tempData){
          if(item.status === "todo"){
              columns[0].cards.push({...item, id: item._id})
          }
          if(item.status === "in progress"){
              columns[1].cards.push({...item,id: item._id})
          }
          if(item.status === "pause"){
              columns[2].cards.push({...item,id: item._id})
          }
          if(item.status === "done"){
              columns[3].cards.push({...item,id: item._id})
          }
          
        }
        return {columns}
      }
      
      return {columns};

}



export const daysCount = (date_1, date_2) => {
  if (date_1 && date_2) {
      let difference = date_1.getTime() - date_2.getTime();
      let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
      return TotalDays;

  } else {
      return 0
  }
}


export const _debounce = (cb, timeout)=> {
  let timer;

  return ()=> {
    clearTimeout(timer);
    timer = setTimeout(()=> {
       cb()
    }, timeout)

  }
}

/**
 * 
 * @param {string} msg 
 * @param {number} duration 
 */
export const successMessageToast = (msg, duration=2000)=> {
  toast.success(msg, { position: toast.POSITION.TOP_CENTER, autoClose: duration, pauseOnHover: false })

}

/**
 * 
 * @param {string} msg 
 * @param {number} duration 
 */
export const errorMessageToast = (msg = "Something went wrong", duration=2000)=> {
  toast.error(msg, { position: toast.POSITION.TOP_CENTER, autoClose: duration, pauseOnHover: false })
}

/**
 * 
 * @param {String} text 
 * @param {Number} maxLength 
 * @returns {String}
 */
export function truncateWithEllipsis(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substring(0, maxLength - 3) + "...";
  }
}


/**
 * 
 * @param {String} stringPath 
 * @returns {String}
 */

export const FromPathTofileName = (stringPath) => {
  const splitPath = stringPath.split("/");
  const fullName = splitPath[splitPath.length-1];
  const fullNameSpliiter = fullName.split("_");
  return fullNameSpliiter.slice(2, fullNameSpliiter.length).join("_");
}

export const mappingFormatValue = (key)=> {
  const object = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/pdf': 'pdf'
  }
  return object[key] ? object[key] : "N/A"
}

  // Convert UTC time to BDT
  export function countDelayDays(data){
    const convertUTCToBDT = (utcDate) => {
      const date = new Date(utcDate);
      // BDT is UTC +6 hours
      date.setHours(date.getHours() + 6);
      return date;
    };
    
    // Define the target time in BDT
    const targetHour = 8;
    const targetMinute = 35;
    
    // Calculate the total delay count
    const totalDelayCount = data.reduce((acc, curr) => {
      if (curr.present) {
        const checkInTime = curr.checkIn ? convertUTCToBDT(curr.checkIn) : null;
        const modifiedCheckInTime = curr.modifiedCheckIn && curr.modifiedCheckIn !== 'Unspecified' 
          ? convertUTCToBDT(curr.modifiedCheckIn) 
          : null;
    
        const checkTime = modifiedCheckInTime || checkInTime;
    
        if (checkTime) {
          const hour = checkTime.getUTCHours();
          const minute = checkTime.getUTCMinutes();
    
          // Check if the check time is later than the target time
          if (hour > targetHour || (hour === targetHour && minute > targetMinute)) {
            acc += 1;
          }
        }
      }
      return acc;
    }, 0);

    return totalDelayCount;

}