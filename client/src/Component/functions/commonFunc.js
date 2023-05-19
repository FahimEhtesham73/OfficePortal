export const profileImg = (imgPath) => {
    if(imgPath){
        const pathArray = imgPath.split("/");
        const lastTwo = `${pathArray[pathArray.length-2]}/${pathArray[pathArray.length-1]}`
        console.log("last two", lastTwo);
        return "http://localhost:3001/images/" + lastTwo;
    }else{
        return ""
    }
}