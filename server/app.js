const express = require('express');
const fs = require('fs');
const app = express();

let csv = 'log.csv';
let nextLog = 1;

//Determine what log file to use, once 20 lines have been put in a log, create new file
//Note doesn't handle case of server begin stopped and re-started and finding latest log file
app.use((req, res, next) => {
    fs.readFile(csv, 'utf8', (err, data) => {
        if (err) throw err;
        if (data.split('\n').length > 20) {
            csv = `log${nextLog}.csv`;
            if (!fs.existsSync(csv)) {
                fs.appendFile(csv, 'Agent,Time,Method,Resource,Version,Status', (err) => {
                    if (err) throw err;
                });
            }
            nextLog += 1;
        }
        next();
    });
});

//Write to log file
app.use((req, res, next) => {
    let ua = req.headers['user-agent'].replace(/,/g,'');  //get rid of any commas
    let status = (/^\/$|^\/logs$/).test(req.url) ? '200' : '404';
    let logmsg = `${ua},${new Date(Date.now()).toISOString()},${req.method},${req.url},HTTP/${req.httpVersion},${status}`;
    console.log(logmsg);
    fs.appendFile(csv, '\n'+logmsg, (err) => {
        if (err) throw err;
    });
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('ok').end();
});

function createJSON(data) {
    let lines = data.split("\n");
    let headers = lines[0].split(",");
    let answer = [];
    for (let i=1;i<lines.length;i++) {
        let obj = {};
        let line = lines[i].split(',');
        for (let j=0;j<headers.length;j++) {
            obj[headers[j]] = line[j];
        }
        answer.push(obj);
    }
    return answer;
}

app.get('/logs', (req, res) => {
    fs.readFile(csv, 'utf8', (err, data) => {
        if (err) throw err;
        let json = createJSON(data);
        res.status(200).json(json);
    })
});

app.get('*', (req, res) => {
    res.status(404).send('Uh oh....').end();
});

module.exports = app;
