#!/usr/bin/env node

// node modules
const http = require('http');
const events = require('events');
const path = require('path');

// custom modules
const utils = require('./utils.js');
const appRoot = path.resolve('');

// API file for data, endpoints and settings
const API = require(`${appRoot}/fakeAPI.json`);

// Emitter for routing
const myEmitter = new events.EventEmitter();

// Listen Requests
const requestListener = (request, response) => {
    try {
        const {method, url} = request;
        let body = '';

        request.on('data', function (data) {
            body += data;

        });
        request.on('end', function () {
 
            console.log("BODY:"+body);
            // Dispatch
        myEmitter.emit(method, url, response, body ? JSON.parse(body) : {});
        });
        

    } catch(err) {
        console.log(err);
    }
};

// ROUTES
const GET_Router = (route, response) => {
    const {name, version} = API.SETTING;

    let isMatch = false;
    response.writeHead(200, {'Content-Type': 'application/json' });

    console.log(`GET: ${route}`);

    Object.keys(API.GET).map(endpoint => {
        
        if(utils.findEndpoint(route, name, version) === endpoint) {
            const lookfor = route.split(`/${name}/${version}/${API.GET[endpoint].path.split('/')[0]}/`)[1] || -1;
         
            const responseData = utils.queryData(API.DATA, API.GET[endpoint].query, lookfor) || {}
            response.write(`{"path": "${API.GET[endpoint].path}", "data": ${JSON.stringify(responseData)}}`);
            response.end();
            isMatch = true;
        }
    })

    if(!isMatch) {
        response.write('{}');
        response.end();
    }

};

const POST_Router = (route, response, body) => {
    const {name, version} = API.SETTING;
    let isMatch = false;

    response.writeHead(200, {'Content-Type': 'application/json' });

    console.log(`POST: ${route}`);

    Object.keys(API.POST).map(endpoint => {
        
        if(utils.findEndpoint(route, name, version) === endpoint) {    
            console.log("endpoint " + endpoint) 
            // check the post body keys match with endpoint's body map
            if(utils.isBodyDataMatch(body, API.POST[endpoint].body)) {
                const data = API.DATA[API.POST[endpoint].query];
                data.push(body);
                console.log(data)
                response.write(`{"path": "${API.POST[endpoint].path}", "data": "created"}`); 
            } else {
                response.write(`{"path": "${API.POST[endpoint].path}", "data": "error"}`);
            }

            response.end();
            isMatch = true;
        }
    })

    if(!isMatch) {
        response.write('{}');
        response.end();
    }

};

const PUT_Router = (route, response, body) => {
    const {name, version} = API.SETTING;
    let isMatch = false;

    response.writeHead(200, {'Content-Type': 'application/json' });

    console.log(`PUT: ${route}`);

    Object.keys(API.PUT).map(endpoint => {
        
        if(utils.findEndpoint(route, name, version) === endpoint) {    
            if(utils.isBodyDataMatch( API.PUT[endpoint].body, body)) {
            console.log("endpoint " + endpoint);
            console.log("query " + API.PUT[endpoint].query);

            const lookforProperty = API.PUT[endpoint].query
            .replace(API.PUT[endpoint].query.split('/')[0]+'/','')
            .replace(/[{}]/g,'');

            const lookfor = body[lookforProperty]
            console.log("lookforProperty " + lookforProperty);
            console.log("lookfor " + lookfor);
            const responseData = utils.queryData(API.DATA, API.PUT[endpoint].query, lookfor) || {}
            console.log("responseData ",responseData);
            const newData = {...responseData[0], ...body}
            console.log("newData " , newData);
            utils.updateData(API.DATA, API.PUT[endpoint].query, lookfor, newData)
           

            
   
                response.write(`{"path": "${API.PUT[endpoint].path}", "data": "updated"}`); 
            } else {
                response.write(`{"path": "${API.PUT[endpoint].path}", "data": "error: missing property on body"}`);
            }

            response.end();
            isMatch = true;
        }
    })

    if(!isMatch) {
        response.write('{}');
        response.end();
    }

};

const DELETE_Router = (route, response) => {
    const {name, version} = API.SETTING;

    let isMatch = false;
    response.writeHead(200, {'Content-Type': 'application/json' });

    console.log(`DELETE: ${route}`);

    Object.keys(API.DELETE).map(endpoint => {
        
        if(utils.findEndpoint(route, name, version) === endpoint) {

            console.log("endpoint " + endpoint);
            console.log("query " + API.DELETE[endpoint].query);

            const lookfor = route.split(`/${name}/${version}/${API.DELETE[endpoint].path.split('/')[0]}/`)[1] || -1;

            console.log("lookfor " + lookfor);
           
            const result = utils.deleteData(API.DATA, API.DELETE[endpoint].query, lookfor)
            
            if(result) {
                response.write(`{"path": "${API.DELETE[endpoint].path}", "data": "deleted"}`); 
            } else {
                response.write(`{"path": "${API.DELETE[endpoint].path}", "data": "error on delete"}`);
            }

            response.end();
            isMatch = true;
        }
    })

    if(!isMatch) {
        response.write('{}');
        response.end();
    }

};

myEmitter.on('GET', GET_Router);
myEmitter.on('POST', POST_Router);
myEmitter.on('PUT', PUT_Router);
myEmitter.on('DELETE', DELETE_Router);

// create server
const server = http.createServer(requestListener);
const PORT = API.SETTING.port || 4001;

// start server
server.listen(PORT, () => console.log(`Server listening on: http://localhost:${PORT}`));