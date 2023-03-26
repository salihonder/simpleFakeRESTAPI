const nJwt = require('njwt');
const secureRandom = require('secure-random');
const fs = require('fs');


const GET_POSTMAN_COLLECTION_OBJ = {
  "name": "",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{AUTH_TOKEN}}",
        "type": "text"
      }
    ],
    "url": {
      "raw": "{{BASE_URL}}{{PORT}}{{API_NAME}}/",
      "host": [
        "{{BASE_URL}}{{PORT}}{{API_NAME}}"
      ],
      "path": [
        "all"
      ]
    }
  },
  "response": []
};

const BODY_POSTMAN_COLLECTION_OBJ = {
  "body": {
    "mode": "raw",
    "raw": "",
    "options": {
      "raw": {
        "language": "json"
      }
    }
  }
};

const ENVIRONMENT_VARIABLES = {
  "id": "",
  "name": "",
  "values": [
    {
      "key": "BASE_URL",
      "value": "",
      "type": "default",
      "enabled": true
    },
    {
      "key": "PORT",
      "value": "",
      "type": "default",
      "enabled": true
    },
    {
      "key": "API_NAME",
      "value": "",
      "type": "default",
      "enabled": true
    },
    {
      "key": "USERNAME",
      "value": "",
      "type": "default",
      "enabled": true
    },
    {
      "key": "PASSWORD",
      "value": "",
      "type": "default",
      "enabled": true
    },
    {
      "key": "AUTH_TOKEN",
      "value": "",
      "type": "default",
      "enabled": true
    }
  ],
  "_postman_variable_scope": "environment",
  "_postman_exported_at": new Date().toISOString(),
  "_postman_exported_using": "Postman/9.21.5"
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const generatePostmanObject = (API) => {

  const GETS = Object.keys(API.GET).map(name => {
    let obj = { ...GET_POSTMAN_COLLECTION_OBJ };
    obj.name = name[0].toUpperCase() + name.substring(1);
    obj.request.method = "GET";
    obj.request.url.raw = `{{BASE_URL}}{{PORT}}{{API_NAME}}/${name}`;
    obj.request.url.path = [name];

    return JSON.parse(JSON.stringify(obj));
  });


  const POSTS = Object.keys(API.POST).map(name => {
    let obj = { ...GET_POSTMAN_COLLECTION_OBJ };
    obj.name = name[0].toUpperCase() + name.substring(1);
    obj.request.method = "POST";
    obj.request.url.raw = `{{BASE_URL}}{{PORT}}{{API_NAME}}/${name}`;

    obj.request.url.path = [name];

    const bodyObj = { ...BODY_POSTMAN_COLLECTION_OBJ };
    bodyObj.body.raw = JSON.stringify(API.POST[name].body);

    obj.request.body = bodyObj.body;

    return JSON.parse(JSON.stringify(obj));
  });

  const PUTS = Object.keys(API.PUT).map(name => {
    let obj = { ...GET_POSTMAN_COLLECTION_OBJ };
    obj.name = name[0].toUpperCase() + name.substring(1);
    obj.request.method = "PUT";
    obj.request.url.raw = `{{BASE_URL}}{{PORT}}{{API_NAME}}/${name}`;

    obj.request.url.path = [name];

    const bodyObj = { ...BODY_POSTMAN_COLLECTION_OBJ };
    bodyObj.body.raw = JSON.stringify(API.PUT[name].body);

    obj.request.body = bodyObj.body;

    return JSON.parse(JSON.stringify(obj));
  });

  const DELS = Object.keys(API.DELETE).map(name => {
    let obj = { ...GET_POSTMAN_COLLECTION_OBJ };
    obj.name = name[0].toUpperCase() + name.substring(1);
    obj.request.method = "DELETE";
    obj.request.url.raw = `{{BASE_URL}}{{PORT}}{{API_NAME}}/${name}`;
    obj.request.url.path = [name];

    delete obj.request.body;

    return JSON.parse(JSON.stringify(obj));
  });


  return { GETS, POSTS, PUTS, DELS };
}

const generatePostmanEnvObject = (API, ENV_NAME) => {
  const Environment_Obj = JSON.parse(JSON.stringify(ENVIRONMENT_VARIABLES));

  Environment_Obj.id = uuid();
  Environment_Obj.name = ENV_NAME == "LOCAL" ? "Local" : "Development";
  // BASE_URL
  Environment_Obj.values[0].value = ENV_NAME == "LOCAL" ? "http://localhost" : API.SETTING.devURL;
  // PORT
  Environment_Obj.values[1].value = ENV_NAME == "LOCAL" ? ":" + API.SETTING.port : ":" + API.SETTING.devPort;
  // API_NAME
  Environment_Obj.values[2].value = "/" + API.SETTING.name;
  // USERNAME
  Environment_Obj.values[3].value = API.DATA.users[0].username;
  // PASSWORD
  Environment_Obj.values[4].value = API.DATA.users[0].password;

  return JSON.stringify(Environment_Obj);
}


const generatePostmanC = (API) => {
  const REQUESTS = generatePostmanObject(API);
  // const LOCAL_ENVIRONMENT = generatePostmanEnvObject(API, 'LOCAL');
  // const DEV_ENVIRONMENT = generatePostmanEnvObject(API, "DEV");

  const postmanObject = {
    "info": {
      "_postman_id": uuid(),
      "name": "FakeAPI 1.3.5 export",
      "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      "_exporter_id": "20589014"
    },
    "item": [
      {
        "name": "Auth",
        "event": [
          {
            "listen": "test",
            "script": {
              "exec": [
                "",
                "var jsonData = pm.response.json();",
                "",
                "pm.environment.set(\"AUTH_TOKEN\", jsonData.tokens[0].auth);"
              ],
              "type": "text/javascript"
            }
          }
        ],
        "request": {
          "auth": {
            "type": "basic",
            "basic": [
              {
                "key": "password",
                "value": "{{PASSWORD}}",
                "type": "string"
              },
              {
                "key": "username",
                "value": "{{USERNAME}}",
                "type": "string"
              }
            ]
          },
          "method": "GET",
          "header": [],
          "url": {
            "raw": "{{BASE_URL}}{{PORT}}{{API_NAME}}/authenticate",
            "host": [
              "{{BASE_URL}}{{PORT}}{{API_NAME}}"
            ],
            "path": [
              "authenticate"
            ]
          }
        },
        "response": []
      },
      {
        "name": "Signout",
        "request": {
          "method": "GET",
          "header": [
            {
              "key": "Authorization",
              "value": "Bearer {{AUTH_TOKEN}}",
              "type": "text"
            }
          ],
          "url": {
            "raw": "{{BASE_URL}}{{PORT}}{{API_NAME}}/signout",
            "host": [
              "{{BASE_URL}}{{PORT}}{{API_NAME}}"
            ],
            "path": [
              "signout"
            ]
          }
        },
        "response": []
      },
      {
        "name": "Refresh",
        "event": [
          {
            "listen": "test",
            "script": {
              "exec": [
                "var jsonData = pm.response.json();",
                "",
                "pm.environment.set(\"AUTH_TOKEN\", jsonData.tokens[0].auth);"
              ],
              "type": "text/javascript"
            }
          }
        ],
        "request": {
          "method": "GET",
          "header": [
            {
              "key": "Authorization",
              "value": "Bearer {{AUTH_TOKEN}}",
              "type": "text"
            }
          ],
          "url": {
            "raw": "{{BASE_URL}}{{PORT}}{{API_NAME}}/refresh",
            "host": [
              "{{BASE_URL}}{{PORT}}{{API_NAME}}"
            ],
            "path": [
              "refresh"
            ]
          }
        },
        "response": []
      },
    ]
  }

  postmanObject.item = [...postmanObject.item, ...REQUESTS.GETS, ...REQUESTS.POSTS, ...REQUESTS.PUTS, ...REQUESTS.DELS];
  return JSON.stringify(postmanObject);
  // If file needs to be written
  // fs.writeFileSync('fakeapi_v1.3.1.postman_collection.json', data);
  // fs.writeFileSync('fakeapi_v1.3.1_local.postman_environment.json', LOCAL_ENVIRONMENT);
  // fs.writeFileSync('fakeapi_v1.3.1_dev.postman_environment.json', DEV_ENVIRONMENT);

}

const refresh = (authResponseHeaders, data, token, response) => {
  checkSession(authResponseHeaders, data, token, response, () => null, false, true)
}

const signout = (authResponseHeaders, data, token, response) => {
  checkSession(authResponseHeaders, data, token, response, () => null, true, false)
}

const checkSession = (authResponseHeaders, data, token, response, cb, isForSignout, isForRefresh) => {

  const strippedToken = token && token.substring(0, 7) == 'Bearer ' ? token.substring(7) : token;
  const signingKey = data['signingKey'] && data['signingKey'][strippedToken] || null;
  console.log("strippedToken", strippedToken)


  if (signingKey && strippedToken) {
    nJwt.verify(strippedToken, signingKey, function (err, verifiedJwt) {

      try {
        if (err || (isForSignout || isForRefresh)) {
          console.log("checkSession: ERROR")
          console.log(err); // Token has expired, has been tampered with, etc
          console.log(Object.keys(data['signingKey']).length)
          delete data['signingKey'][strippedToken]
          console.log('signedout/expired token removed from the list')
          console.log(Object.keys(data['signingKey']).length)

          if (isForSignout) {
            console.log('signedout true')

            response.write(`{"Signout successfully"}`);
            response.end();
          } else if (isForRefresh) {
            console.log('Token refreshed true')
            let username = ''
            // token expired
            if (err) {
              console.log("expired verifiedJwt sub: ", err.parsedBody.sub)
              username = err.parsedBody.sub
              // token not expired yet
            } else {
              console.log("note expired verifiedJwt sub: ", verifiedJwt.body.sub)
              username = verifiedJwt.body.sub
            }

            const tokenObj = getJWT(username, data, 'token');

            const foundUserObj = {
              tokens: [
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


            response.end();
          } else {
            console.log('signedout false')
            response.write(`{"Token is expired!!!"}`);
            response.end();
          }



        } else {
          console.log("checkSession: VERIFIED")
          console.log(verifiedJwt); // Will contain the header and body
          cb()
        }
      } catch (err) {
        console.log(err)
      }

    });
  } else {
    response.writeHead(401, authResponseHeaders);
    console.log("No Signing key or token")
    response.write(`{"Token is not verified!!!"}`);
    response.end();
  }



}

function getJWT(username, data, tokenType) {
  var signingKey = secureRandom(256, { type: 'Buffer' }); // Create a highly random byte array of 256 bytes

  console.log("getJWT", username)
  var claims = {
    iss: "example://test/",  // The URL of your service
    sub: username,    // The UID of the user in your system
    scope: "admin"
  }

  const jwt = nJwt.create(claims, signingKey);
  const expiration = 12 * 60 * 60 * 1000
  jwt.setExpiration(new Date().getTime() + expiration); // One min from now

  console.log(jwt)
  const token = jwt.compact();
  console.log(token);

  if (tokenType) {
    //data['signingKey'] = signingKey;
    data['signingKey'] = {
      ...data['signingKey'],
      [token]: signingKey
    };

    console.log("signingKey ****************** ", data['signingKey'])
  }

  return { token, expiration };
}

function updateData(name, version, data, query, endpoint, route, body) {
  const splitArr = query.split('/');
  const select = splitArr[0];
  const where = splitArr[1].replace(/[{}]/g, '');
  const replaceString = version ? `/${name}/${version}/` : `/${name}/`;

  const conditionKeys = where.split(',');
  const isArray = Array.isArray(data[select]);

  route.replace(replaceString, '').split('/')[0] || '';
  const pathArr = route.replace(replaceString, '').split('/');
  const endpointArr = endpoint.split('/');

  const params = {};

  // Get parameters
  endpointArr.map((item, index) => {
    if (/^{[A-Za-z0-9]*}$/.test(item)) {
      params[removeBrackets(item)] = pathArr[index];
    }
  });

  try {
    if (isArray) {
      const qresult = data[select].map((o) => {
        const shouldUpdate = conditionKeys.every(
          (conditionKey) => o[conditionKey] == params[conditionKey]
        );

        return shouldUpdate ? { ...o, ...body } : o;
      });

      data[select] = qresult;
    } else {
      const qresult = Object.keys(data[select]).map((oID) => {
        const shouldUpdate = conditionKeys.every(
          (conditionKey) => data[select][oID][conditionKey] == params[conditionKey]
        );
        return shouldUpdate ? { ...data[select][oID], ...body } : data[select][oID];
      });

      data[select] = qresult;
    }
  } catch (e) {
    return false;
  }

  return true;
}

function postData(name, version, data, query, endpoint, route, body) {
  const splitArr = query.split('/');
  const select = splitArr[0];
  // const where = splitArr[1].replace(/[{}]/g, '')
  const replaceString = version ? `/${name}/${version}/` : `/${name}/`;

  // const conditionKeys = where.split(',')
  const isArray = Array.isArray(data[select]);

  route.replace(replaceString, '').split('/')[0] || '';
  const pathArr = route.replace(replaceString, '').split('/');
  const endpointArr = endpoint.split('/');

  const params = {};

  // Get parameters
  endpointArr.map((item, index) => {
    if (/^{[A-Za-z0-9]*}$/.test(item)) {
      params[removeBrackets(item)] = pathArr[index];
    }
  });

  const uniqueID = Date.now();

  try {
    if (isArray) {
      data[select].push({
        ...params,
        ...body,
      });
    } else {
      data[select][uniqueID] = {
        ...params,
        ...body,
      };
    }
  } catch (e) {
    return false;
  }

  return true;
}

function deleteData(name, version, data, query, endpoint, route) {
  const splitArr = query.split('/');
  const select = splitArr[0];
  const where = splitArr[1].replace(/[{}]/g, '');
  const replaceString = version ? `/${name}/${version}/` : `/${name}/`;

  const conditionKeys = where.split(',');
  const isArray = Array.isArray(data[select]);

  route.replace(replaceString, '').split('/')[0] || '';
  const pathArr = route.replace(replaceString, '').split('/');
  const endpointArr = endpoint.split('/');

  const params = {};

  // Get parameters
  endpointArr.map((item, index) => {
    if (/^{[A-Za-z0-9]*}$/.test(item)) {
      params[removeBrackets(item)] = pathArr[index];
    }
  });

  try {
    if (isArray) {
      const qresult = data[select].filter((o) => {
        return conditionKeys.some((conditionKey) => o[conditionKey] != params[conditionKey]);
      });

      data[select] = qresult;
    } else {
      const resArr = Object.keys(data[select]).filter((oID) => {
        return conditionKeys.some(
          (conditionKey) => data[select][oID][conditionKey] != params[conditionKey]
        );
      });

      const qresult = resArr.reduce((obj, item) => ({ ...obj, [item]: data[select][item] }), {});

      data[select] = qresult;
    }
  } catch (e) {
    return false;
  }

  return true;
}

function findEndpoint(route, name, version) {
  const replaceString = version ? `/${name}/${version}/` : `/${name}/`;
  return route.replace(replaceString, '').split('/')[0] || '';
}

function isEndPointMatch(route, name, version, endpoint) {
  const replaceString = version ? `/${name}/${version}/` : `/${name}/`;
  route.replace(replaceString, '').split('/')[0] || '';
  const pathArr = route.replace(replaceString, '').split('/');
  const endpointArr = endpoint.split('/');

  if (pathArr.length != endpointArr.length) {
    return false;
  } else {
    const isMatch = endpointArr.every((item, index) => {
      let isItemMatch = false;

      if (/^{[A-Za-z0-9]*}$/.test(item)) {
        isItemMatch = pathArr[index] ? true : false;
      } else {
        isItemMatch = pathArr[index] === item ? true : false;
      }
      return isItemMatch;
    });

    return isMatch;
  }
}

function isBodyDataMatch(postBody, mapBody) {
  if (postBody instanceof Object && mapBody instanceof Object) {
    const mapKeys = Object.keys(mapBody);
    const postBodyKeys = Object.keys(postBody);
    return mapKeys.every((key) => postBodyKeys.includes(key));
  }

  return false;
}

const removeBrackets = (item) => item.replace(/[{}]/g, '');
const filter = (data, syntax, isArray) => {
  let results;

  const filterParam = syntax.substring(syntax.indexOf('[') + 1, syntax.indexOf(']'));

  if (filterParam == '') return data;
  if (isArray) {
    results = data.map((o) => {
      return filterParam.split(',').reduce((obj, item) => ({ ...obj, [item]: o[item] }), {});
    });
  } else {
    results = Object.keys(data).reduce((o, k) => {
      const filteredObj = filterParam
        .split(',')
        .reduce((obj, item) => ({ ...obj, [item]: data[k][item] }), {});
      return { ...o, [k]: filteredObj };
    }, {});
  }

  return results;
};
const convert = (data, syntax, isArray) => {
  const convertTo = syntax.split(':')[1];

  if (convertTo && convertTo.includes('Array')) {
    if (isArray) {
      return data;
    } else {
      return Object.keys(data).map((k) => data[k]);
    }
  } else if (convertTo && convertTo.includes('Object')) {
    if (isArray) {
      return data.reduce((o, item, i) => {
        return { ...o, [i + 1]: item };
      }, {});
    } else {
      return data;
    }
  }

  return data;
};
function getQueryParams(name, version, endpoint, route) {
  const replaceString = version ? `/${name}/${version}/` : `/${name}/`;
  route.replace(replaceString, '').split('/')[0] || '';
  const pathArr = route.replace(replaceString, '').split('/');
  const endpointArr = endpoint.split('/');
  const params = {};

  // Get parameters
  endpointArr.map((item, index) => {
    if (/^{[A-Za-z0-9]*}$/.test(item)) {
      params[removeBrackets(item)] = pathArr[index];
    }
  });

  return params;
}

function queryData(name, version, data, response, endpoint, route) {
  const replaceString = version ? `/${name}/${version}/` : `/${name}/`;
  route.replace(replaceString, '').split('/')[0] || '';
  const pathArr = route.replace(replaceString, '').split('/');
  const endpointArr = endpoint.split('/');
  const params = {};
  const result = {};

  // Get parameters
  endpointArr.map((item, index) => {
    if (/^{[A-Za-z0-9]*}$/.test(item)) {
      params[removeBrackets(item)] = pathArr[index];
    }
  });

  const responseKeys = Object.keys(response);

  // Prepare query results for each response props
  Object.values(response).map((item, index) => {

    // {parameter}
    if (/^{[A-Za-z0-9]*}$/.test(item)) {
      result[removeBrackets(item)] = params[removeBrackets(item)];
      // constant value or query
    } else {
      const splitArr = item.substring(0, item.indexOf('}') + 1).split('/');
      const select = splitArr[0];
      const whereType = splitArr[1] ? removeBrackets(splitArr[1]) : 'constant';

      if (whereType === '*') {
        result[responseKeys[index]] = data[select];

        const isArray = Array.isArray(data[select]);

        if (isArray) {
          const qresult = data[select];
          const filterResults = filter(qresult, item, isArray);

          const convertResults = convert(filterResults, item, isArray);

          result[responseKeys[index]] = convertResults;
        } else {
          const resArr = Object.keys(data[select]).filter((oID) => {
            return data[select][oID];
          });

          const qresult = resArr.reduce(
            (obj, item) => ({ ...obj, [item]: data[select][item] }),
            {}
          );

          const filterResults = filter(qresult, item, isArray);

          const convertResults = convert(filterResults, item, isArray);

          result[responseKeys[index]] = convertResults;
        }
      } else if (whereType === 'constant') {
        result[responseKeys[index]] = item;
        // filter with given params
      } else {
        const conditionKeys = whereType.split(',');
        const isArray = Array.isArray(data[select]);



        if (isArray) {
          const qresult = data[select].filter((o) => {
            return conditionKeys.every((conditionKey) => o[conditionKey] == params[conditionKey]);
          });


          const filterResults = filter(qresult, item, isArray);


          const convertResults = convert(filterResults, item, isArray);



          result[responseKeys[index]] = convertResults;
        } else {
          const resArr = Object.keys(data[select]).filter((oID) => {
            return conditionKeys.every(
              (conditionKey) => data[select][oID][conditionKey] == params[conditionKey]
            );
          });

          const qresult = resArr.reduce(
            (obj, item) => ({ ...obj, [item]: data[select][item] }),
            {}
          );

          const filterResults = filter(qresult, item, isArray);

          const convertResults = convert(filterResults, item, isArray);

          result[responseKeys[index]] = convertResults;
        }
      }
    }
  });

  return result;
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
}

exports.queryData = queryData;
exports.findEndpoint = findEndpoint;
exports.isEndPointMatch = isEndPointMatch;
exports.isBodyDataMatch = isBodyDataMatch;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.postData = postData;
exports.removeBrackets = removeBrackets;
exports.syntaxHighlight = syntaxHighlight;
exports.getJWT = getJWT;
exports.checkSession = checkSession;
exports.getQueryParams = getQueryParams;
exports.signout = signout;
exports.refresh = refresh;
exports.generatePostmanC = generatePostmanC;
exports.generatePostmanEnvObject = generatePostmanEnvObject;