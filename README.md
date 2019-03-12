# Project Description
Design a user friendly interface for visualization of results from machine learning data.

# Running Project
- setup mongodb on local machine
- change mongodb port numbers in `root/database.ts` if not using default
- start mongodb
- install necessary packages
    - `npm install` for `root/package.json`
    - `cd client/ && npm install` for `root/client/package.json`
- start express server in root directory: `npm start`
- start node server with react app in root/client directory: `npm start`
- visit page at localhost:3000

# Shutting Down Project
- find the PID and kill it

## Notes
I chose to save time on creating the table and carousel by leveraging existing
modules: `material-ui`, react-slick. The modules coming prebuilt with styling
created a cleaner display than otherwise possible. I also used a few additional
libraries to assist with serving the app (express) and handling asynchronous
data (rxjs). Given more time, there is more that I would choose to do for this
project (e.g. refactor for consistent code style and easier reuse).
