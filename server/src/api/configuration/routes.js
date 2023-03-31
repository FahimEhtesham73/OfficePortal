const userRouters = require("../routers/userRouter");
const roleRouters = require("../routers/roleRouter");
const departmentRouters = require("../routers/departmentRouter");
const designationRouters = require("../routers/designationRouter");




const v1 = "/api/v1"
module.exports = (app) => {
    app.use(`${v1}/users`, userRouters);
    app.use(`${v1}/roles`, roleRouters);
    app.use(`${v1}/depts`, departmentRouters);
    app.use(`${v1}/designations`, designationRouters);


    


}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWJjNTk1ZTQwOWQ3MWM2YjAwN2I0ZSIsImlhdCI6MTY3OTU0MTgyMCwiZXhwIjoxNjgwMTQ2NjIwfQ.Et3TVdf3O4Bww3PVYKNGAxsumm49FnFGyLLFDI8mKoc