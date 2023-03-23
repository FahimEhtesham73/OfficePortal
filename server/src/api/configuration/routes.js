const userRouters = require("../routers/userRouter");


module.exports = (app) => {
    app.use("/api/v1/users", userRouters);
    


}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWJjNTk1ZTQwOWQ3MWM2YjAwN2I0ZSIsImlhdCI6MTY3OTU0MTgyMCwiZXhwIjoxNjgwMTQ2NjIwfQ.Et3TVdf3O4Bww3PVYKNGAxsumm49FnFGyLLFDI8mKoc