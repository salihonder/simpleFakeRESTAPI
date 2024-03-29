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
const { name, version, versionNumber } = API.SETTING;
const Functions = require(`${appRoot}/functions`);

// Emitter for routing
const myEmitter = new events.EventEmitter();

const responseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
  'Access-Control-Max-Age': 2592000,
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Authorization,Content-Type',
  'X-Requested-With': '*',
};

const authResponseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Authorization,Content-Type',
  'Access-Control-Max-Age': '3600',
};

// Listen Requests
const requestListener = (request, response) => {
  try {
    const { method, url, headers } = request;
    let body = '';

    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      console.log('BODY: ' + body);
      let parsedBody = {};

      if (body) {
        try {
          parsedBody = JSON.parse(body);
          console.log("Headers", headers)
          utils.checkSession(authResponseHeaders, API.DATA, headers['authorization'], response, () => {
            // Dispatch
            myEmitter.emit(method, url, response, parsedBody, headers);
          })


        } catch (e) {
          console.log(e);
          response.write(`{"error": "Correct JSON body format"}`);

          response.end();
        }
      } else {
        // Dispatch

        const root = version ? `/${name}/${version}` : `/${name}`;
        const isRoot = root == url || `${root}/` == url ? true : false;


        if (isRoot || url.split('/')[2] == 'authenticate') {

          myEmitter.emit(method, url, response, parsedBody, headers);
        } else if (url.split('/')[2] == 'signout') {
          console.log("IT IS SIGNOUT....")

          utils.signout(authResponseHeaders, API.DATA, headers['authorization'], response)
        } else if (url.split('/')[2] == 'refresh') {
          console.log("IT IS REFRESH....")

          utils.refresh(authResponseHeaders, API.DATA, headers['authorization'], response)
        } else {
          utils.checkSession(authResponseHeaders, API.DATA, headers['authorization'], response, () => {
            // Dispatch
            myEmitter.emit(method, url, response, parsedBody, headers);
          })
        }

      }
    });
  } catch (err) {
    console.log(err);
  }
};

// ROUTES
const OPTIONS_Router = (route, response, body, headers) => {
  console.log(`OPTIONS: ${route}`);
  response.writeHead(204, responseHeaders);

  response.end();
};
const GET_Router = (route, response, body, headers) => {
  console.log(`GET: ${route}`);

  const root = version ? `/${name}/${version}` : `/${name}`;
  const isRoot = root == route || `${root}/` == route ? true : false;

  if (isRoot) {
    // remove jwt keys
    const currentData = { ...API.DATA }
    delete currentData.signingKey;

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(`<!doctype html>
        <html lang="en">
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">  	
        <link rel="icon" href="data:,">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <style>
        body {
            padding: 24px
        }
        .title {
            text-transform: capitalize;
        }
        .version {
            position: relative;
            bottom: 3ex;
        }.
        .endpoint {
            font-weight: bold;
        }
        .w3-button {
            width: 100px;
        }
        pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
        .string { color: green; }
        .number { color: darkorange; }
        .boolean { color: blue; }
        .null { color: magenta; }
        .key { color: red; }

        </style>
        <title>Simple Fake API - v</title>
        
        </head>

        <body>
        <h1>
            <span class='title'>${name}</span> API 
            <span class="version w3-tag w3-tiny w3-dark-grey">${versionNumber}</span>
        </h1>
        
        <hr />
        <a href='https://www.npmjs.com/package/simplefakeapi'>For documentations click here</a>
        <hr />
        <h2>Postman Collection and Environment</h2>
        <hr />
        <h3 id="postman"> <a href="${"data:text/json;charset=utf-8," + encodeURIComponent(utils.generatePostmanC(API))}" download="fakeapi-v1.3.5.postman_collection.json">Download Postman Collection</a></h3>
        <h3 > <a href="${"data:text/json;charset=utf-8," + encodeURIComponent(utils.generatePostmanEnvObject(API, 'LOCAL'))}"
         download="fakeapi_v1.3.5_local.postman_environment.json">Download Local Environment Variables</a></h3> 
      
        <hr />
        <h2>${root}</h2>
        <div class="w3-card w3-margin-bottom w3-light-blue">
        <button class="w3-button w3-blue">GET</button>
        <label class="endpoint">authenticate</label>
        </div>
        <div class="w3-card w3-margin-bottom w3-light-blue">
        <button class="w3-button w3-blue">GET</button>
        <label class="endpoint">signout</label>
        </div>
        <div class="w3-card w3-margin-bottom w3-light-blue">
        <button class="w3-button w3-blue">GET</button>
        <label class="endpoint">refresh</label>
      </div>
        ${Object.keys(API.GET)
        .map(
          (key) => `<div class="w3-card w3-margin-bottom w3-light-blue">
        <button class="w3-button w3-blue">GET</button>
        <label class="endpoint">${key}</label>
      </div>`
        )
        .join('')}
      ${Object.keys(API.POST)
        .map(
          (key) => `<div class="w3-card w3-margin-bottom w3-pale-green">
        <button class="w3-button w3-green">POST</button>
        <label class="endpoint">${key}</label>
      </div>`
        )
        .join('')}
      ${Object.keys(API.PUT)
        .map(
          (key) => `<div class="w3-card w3-margin-bottom w3-amber">
        <button class="w3-button w3-orange">PUT</button>
        <label class="endpoint">${key}</label>
      </div>`
        )
        .join('')}
      ${Object.keys(API.DELETE)
        .map(
          (key) => `<div class="w3-card w3-margin-bottom w3-pale-red">
        <button class="w3-button w3-red">DELETE</button>
        <label class="endpoint">${key}</label>
      </div>`
        )
        .join('')}

       <h2>Data</h2> 
        <pre>
        ${utils.syntaxHighlight(JSON.stringify(currentData, undefined, 4))}
        </pre>

  
        </body>
        </html>
        `);
  } else {
    const responseCode = route.split(':')[1];

    if (responseCode) {
      response.writeHead(responseCode, {
        responseHeaders,
      });
      response.write(`${JSON.stringify(API.ERROR[responseCode])}`);
      // } else if (route == `/${name}/${version}/signout` || route == `/${name}/signout`) {
      //   // console.log("headers.authorization", headers.authorization)
      //   utils.signout(authResponseHeaders, API.DATA, headers['authorization'], response)
    } else if (route == `/${name}/${version}/authenticate` || route == `/${name}/authenticate`) {
      const encodedAuth = (headers.authorization || '').split(' ')[1] || '';

      const [username, password] = Buffer.from(encodedAuth, 'base64').toString().split(':');

      if (API.DATA.users && API.DATA.users.length > 0) {
        const foundUser = API.DATA.users.find(
          (u) => u.username == username && u.password == password
        );

        console.log('Authorized user', foundUser);
        if (foundUser) {
          const tokenObj = utils.getJWT(foundUser.username, API.DATA, 'token');

          const foundUserObj = {
            ...foundUser, tokens: [
              {
                auth: tokenObj.token,
                expiration: tokenObj.expiration / (60 * 1000)
              }
            ],
            session: "",
            referenceId: "",
            status: "",
          }
          response.writeHead(200, authResponseHeaders);

          response.write(`${JSON.stringify(foundUserObj)}`);
        } else {
          response.writeHead(401, authResponseHeaders);
          response.write(`Unauthorized Access`);
        }
      } else {
        response.writeHead(401, {
          responseHeaders,
        });
        response.write(`Missing users section. Add a user`);
      }
    } else {
      const isAllHeadersIncluded = API.SETTING.headers.every((h) => headers[h] != null);

      if (!isAllHeadersIncluded) {
        response.writeHead(400, responseHeaders);
        response.write(
          `{ "message": "missing header(s)",
                       "headers": ${JSON.stringify(API.SETTING.headers)}}`
        );
      } else {
        let isMatch = false;
        response.writeHead(200, responseHeaders);

        Object.keys(API.GET).map((endpoint) => {
          if (utils.isEndPointMatch(route, name, version, endpoint)) {

            console.log("ENDPOINT", API.GET[endpoint]);

            if (API.GET[endpoint].function !== undefined && API.GET[endpoint].function != '') {

              const params = utils.getQueryParams(name, version, endpoint, route)

              const responseData = Functions[API.GET[endpoint].function](API.DATA, params)
              response.write(`${JSON.stringify(responseData)}`);

              isMatch = true;

            } else {
              const responseData =
                utils.queryData(name, version, API.DATA, API.GET[endpoint], endpoint, route) || {};

              response.write(`${JSON.stringify(responseData)}`);

              isMatch = true;
            }


          }
        });

        if (!isMatch) {
          response.write('{}');
        }
      }
    }
  }


  response.end();

};

const POST_Router = (route, response, body, headers) => {
  console.log(`POST: ${route}`);
  const responseCode = route.split(':')[1];

  if (responseCode) {
    response.writeHead(responseCode, responseHeaders);
    response.write(`${JSON.stringify(API.ERROR[responseCode])}`);

    response.end();
  } else {
    const isAllHeadersIncluded = API.SETTING.headers.every((h) => headers[h] != null);

    if (!isAllHeadersIncluded) {
      response.writeHead(400, responseHeaders);
      response.write(
        `{ "message": "missing header(s)",
                   "headers": ${JSON.stringify(API.SETTING.headers)}}`
      );

      response.end();
    } else {
      let isMatch = false;
      response.writeHead(200, responseHeaders);

      Object.keys(API.POST).map((endpoint) => {
        if (utils.isEndPointMatch(route, name, version, endpoint)) {
          // check the post body keys match with endpoint's body map
          if (utils.isBodyDataMatch(body, API.POST[endpoint].body)) {

            if (API.POST[endpoint].queryonly) {

              const responseResult = utils.queryData(name, version, API.DATA, API.POST[endpoint].result, endpoint, route) || {};
              if (responseResult) {
                response.write(`${JSON.stringify(responseResult)}`);
              } else {
                response.write(`{"path": "${endpoint}", "data": "error on post"}`);
              }
            } else {
              console.log("API.POST[endpoint].function ", API.POST[endpoint].function);
              if (API.POST[endpoint].function !== undefined && API.POST[endpoint].function !== '') {
                console.log("HERE....")
                const params = { ...utils.getQueryParams(name, version, endpoint, route), ...body }

                const responseData = Functions[API.POST[endpoint].function](API.DATA, params)

                console.log("params", params)
                console.log("responseData", responseData)
                if (responseData) {
                  response.write(`${JSON.stringify(responseData)}`);
                } else {
                  response.write(`{"path": "${endpoint}", "data": "error on post"}`);
                }

              } else {
                const result = utils.postData(
                  name,
                  version,
                  API.DATA,
                  API.POST[endpoint].where,
                  endpoint,
                  route,
                  body,

                );
                if (result) {
                  response.write(`${JSON.stringify(API.POST[endpoint].result)}`);
                } else {
                  response.write(`{"path": "${endpoint}", "data": "error on post"}`);
                }
              }

            }

          } else {
            response.write(`{"path": "${endpoint}", "data": "body properties missing!"}`);
          }

          response.end();
          isMatch = true;
        }
      });

      if (!isMatch) {
        response.write('{}');

        response.end();
      }
    }
  }
};

const PUT_Router = (route, response, body, headers) => {
  console.log(`PUT: ${route}`);
  const responseCode = route.split(':')[1];

  if (responseCode) {
    response.writeHead(responseCode, responseHeaders);
    response.write(`${JSON.stringify(API.ERROR[responseCode])}`);

    response.end();
  } else {
    const isAllHeadersIncluded = API.SETTING.headers.every((h) => headers[h] != null);

    if (!isAllHeadersIncluded) {
      response.writeHead(400, responseHeaders);
      response.write(
        `{ "message": "missing header(s)",
                   "headers": ${JSON.stringify(API.SETTING.headers)}}`
      );

      response.end();
    } else {
      let isMatch = false;
      response.writeHead(200, responseHeaders);

      Object.keys(API.PUT).map((endpoint) => {
        if (utils.isEndPointMatch(route, name, version, endpoint)) {
          if (utils.isBodyDataMatch(API.PUT[endpoint].body, body)) {
            const result = utils.updateData(
              name,
              version,
              API.DATA,
              API.PUT[endpoint].where,
              endpoint,
              route,
              body
            );

            if (result) {
              response.write(`${JSON.stringify(API.PUT[endpoint].result)}`);
            } else {
              response.write(`{"path": "${endpoint}", "data": "error on update"}`);
            }
          } else {
            response.write(
              `{"path": "${API.PUT[endpoint].path}", "data": "error: missing property on body"}`
            );
          }

          response.end();
          isMatch = true;
        }
      });

      if (!isMatch) {
        response.write('{}');

        response.end();
      }
    }
  }
};

const DELETE_Router = (route, response, body, headers) => {
  console.log(`DELETE: ${route}`);
  const responseCode = route.split(':')[1];

  if (responseCode) {
    response.writeHead(responseCode, responseHeaders);
    response.write(`${JSON.stringify(API.ERROR[responseCode])}`);

    response.end();
  } else {
    const isAllHeadersIncluded = API.SETTING.headers.every((h) => headers[h] != null);

    if (!isAllHeadersIncluded) {
      response.writeHead(400, responseHeaders);
      response.write(
        `{ "message": "missing header(s)",
                   "headers": ${JSON.stringify(API.SETTING.headers)}}`
      );

      response.end();
    } else {
      let isMatch = false;
      response.writeHead(200, responseHeaders);

      Object.keys(API.DELETE).map((endpoint) => {
        if (utils.isEndPointMatch(route, name, version, endpoint)) {
          const result = utils.deleteData(
            name,
            version,
            API.DATA,
            API.DELETE[endpoint].where,
            endpoint,
            route
          );

          if (result) {
            response.write(`${JSON.stringify(API.DELETE[endpoint].result)}`);
          } else {
            response.write(`{"path": "${endpoint}", "data": "error on delete"}`);
          }

          response.end();
          isMatch = true;
        }
      });

      if (!isMatch) {
        response.write('{}');

        response.end();
      }
    }
  }
};

myEmitter.on('GET', GET_Router);
myEmitter.on('POST', POST_Router);
myEmitter.on('PUT', PUT_Router);
myEmitter.on('DELETE', DELETE_Router);
myEmitter.on('OPTIONS', OPTIONS_Router);

// create server
const server = http.createServer(requestListener);
const PORT = API.SETTING.port || 4001;

// start server
server.listen(PORT, () => {
  console.log(`======================`);
  console.log(`Simple Fake API v1.3.5`);
  console.log(`======================`);
  console.log(`Server listening on: http://localhost:${PORT}`);
  console.log('Press Ctrl + C to exit');
});