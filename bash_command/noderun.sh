#!/bin/bash

#start mongodb process
systemctl start mongod
systemctl enable mongod
# Navigate to the desired folder
cd "/home/nslserver/nsl_official_portal/Leave_Management_System/server"

# Run the Node.js script
npm run cluster
