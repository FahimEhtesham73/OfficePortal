//error message formatter
module.exports.validationMessages = (msg) => {
    let obj = {};
    for (m in msg) {
      obj[m.toLowerCase()] = msg[m].msg;
    }
    return obj;
  };

//req body error params
module.exports.isErrorFounds = (errors={})=> {
  if(Object.entries(errors).length > 0){
    return true;
  }
  return false;
}