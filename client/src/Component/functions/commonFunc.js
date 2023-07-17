export const profileImg = (imgPath) => {
    if(imgPath){
        const pathArray = imgPath.split("/");
        const lastTwo = `${pathArray[pathArray.length-2]}/${pathArray[pathArray.length-1]}`
        // console.log("last two", lastTwo);
        return "http://localhost:3001/images/" + lastTwo;
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

   const columns = [
        {
          id: 1,
          title: "Open",
          cards: [
            
          ],
        },
        {
          id: 2,
          title: "Doing",
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
      if(data.length){
        for(let item of data){
          if(item.status === "open"){
              columns[0].cards.push({...item, id: item._id})
          }
          if(item.status === "doing"){
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
      console.log("achi");
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
