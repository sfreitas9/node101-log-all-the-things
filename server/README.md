# NODE101 Log All The Things

This server app will log all requests to itself in log.csv. It will create new log files as the log files get longer, however, does not handle the case where the server is stopped and restarted in terms of finding the latest log file.  

## To install:
```
npm install
```
---
## To run:
```
npm start
```
Then go to http://localhost:3000/ in your browser.
You can also go to http://localhost:3000/logs to see the logs in JSON format.
If you go to http://localhost:3000/anythingelse you will get a 404 error.
---
## To test, in separate terminals, run:
```
npm start
npm test
```