# Fake REST API

Creates a simple fake REST API from a single json file.

![](https://img.shields.io/badge/version-v1.3.4-blue)
![](https://img.shields.io/badge/node-v16.13.1-green)
![](https://img.shields.io/badge/npm-8.1.2-green)
![](https://img.shields.io/badge/react-17.0.2-green)
![](https://img.shields.io/badge/postman-9.21.5-green)

- Exporting to Postman as a collection with variables
- Advance built-in queries
- Functions for GET and POST endpoints
- Deploying to VMs
- Auth, Signout, and Refresh
- Session management

## Setup

- Make sure you create a file named **fakeAPI.json** with content on your project's root folder. You can see the content of the file below.
- Add script `"fakeapi": "npx fakeapi"` to package.json
- npm run fakeapi

Check your APIs on `http://localhost:4000/systemtest` by default.

Your service will be run on `http://localhost:4000`

## Display APIs

Base on your **fakeAPI.json** SETTINGS

![](https://i.ibb.co/cNbZPv1/Screen-Shot-2022-09-01-at-12-28-32-AM.png)


http://localhost:{port}/{name}/{version}
if you pass SETTINGS.version as empty or remove it path will be

http://localhost:{port}/{name}

## Documentation

Create a file named **fakeAPI.json** with content same as below

Modify **fakeAPI.json** base on your API choice

```json
{
    "GET": {
        "testfunc/{siteId}": {
            "function": "test"
        },
        "store/{id}/status": {
            "status": "Open",
            "storeId": "{id}",
            "address": "stores/{id}[address,city,state]"
        },
        "all": {
            "users": "users/{*}",
            "departments": "departments/{*}",
            "stores": "stores/{*}"
        },
        "usernames": {
            "users": "users/{*}[name]"
        },
        "itusers/{dip}": {
            "users": "users/{dip}[name]: Object"
        },
        "departments": {
            "departments": "departments/{*}[department]: Array"
        }
    },
    "POST": {
        "department/testpost/{employeeId}": {
            "function": "testpost",
            "body": {
                "startDate": "2021-02-18",
                "endDate": "2021-02-28"
            }
        },
        "department/employee/{employeeId}": {
            "queryonly": true,
            "result": {
                "some": "data",
                "somemore": "data here",
                "user": "users/{employeeId}"
            },
            "body": {
                "startDate": "2021-02-18",
                "endDate": "2021-02-28"
            }
        },
        "departments": {
            "result": {
                "message": "created"
            },
            "where": "departments/{*}",
            "body": {
                "id": 1,
                "department": "IT"
            }
        },
        "createUser": {
            "result": {
                "message": "created"
            },
            "where": "users/{*}",
            "body": {
                "id": 1,
                "name": "name",
                "lastName": "lastName",
                "username": "salih@gmail.com",
                "password": "password"
            }
        }
     
    },
    "PUT": {
        "departments/{id}/name/{department}": {
            "result": {
                "message": "updated"
            },
            "where": "departments/{id,department}",
            "body": {
                "id": 1,
                "department": "HR"
            }
        },
        "updateUser/{lastName}/department/{dip}": {
            "result": {
                "message": "updated"
            },
            "where": "users/{dip,lastName}",
            "body": {
                "id": 1,
                "name": "Salih",
                "lastName": "Onder",
                "dip": 1
            }
        }
    },
    "DELETE": {
        "deleteUser/{id}": {
            "result": {
                "message": "deleted"
            },
            "where": "users/{id}"
        },
        "departments/{id}": {
            "result": {
                "message": "deleted"
            },
            "where": "departments/{id}"
        }
    },
    "ERROR": {
        "404": {
            "status": {
                "code": "404",
                "messages": [
                    {
                        "type": "Error",
                        "message": "Not found.."
                    }
                ]
            }
        },
        "500": {
            "status": {
                "code": "500",
                "messages": [
                    {
                        "type": "Error",
                        "message": "No response!"
                    }
                ]
            }
        }
    },
    "DATA": {
        "departments": {
            "1": {
                "id": 1,
                "department": "IT"
            },
            "2": {
                "id": 2,
                "department": "HR"
            },
            "3": {
                "id": 3,
                "department": "MARKETING"
            }
        },
        "users": [
            {
                "id": 1,
                "name": "Salih",
                "lastName": "Onder",
                "dip": 1,
                "username": "salih@gmail.com",
                "password": "password",
                "companyid": 1,
                "employeeid": 1
            },
            {
                "id": 2,
                "name": "Sinan",
                "lastName": "Onder",
                "dip": 1,
                "username": "sinan@gmail.com",
                "password": "password",
                "companyid": 1,
                "employeeid": 2
            },
            {
                "id": 3,
                "name": "Semih",
                "lastName": "Onder",
                "dip": 1,
                "username": "semih@gmail.com",
                "password": "password",
                "companyid": 1,
                "employeeid": 3
            }
            
            
        ],
        "stores": [
            {
                "id": 1,
                "address": "6301 Northwest Loop 410",
                "city": "San Antonio",
                "state": "TX",
                "zip": "78238",
                "mall": "Ingram Park Mall"
            },
            {
                "id": 2,
                "address": "2310 SW Military Dr",
                "city": "San Antonio",
                "state": "TX",
                "zip": "78224",
                "mall": "South Park Mall"
            },
            {
                "id": 3,
                "address": "2310 SW Military Dr",
                "city": "Lubbock",
                "state": "TX",
                "zip": "79414",
                "mall": "South Plains Mall"
            }
            
            
        ]
    },
    "SETTING": {
        "name": "systemtest",
        "version": "",
        "versionNumber": "1.0.0",
        "headers": [],
        "port": 4000
    }
}
```

### GET

`http://localhost:4000/systemtest/all `

```json
"GET": {
 "all": {
            "users": "users/{*}",
            "departments": "departments/{*}",
    }
}

```

- GET `users/{*}`: List all users from fakeAPI.json --> DATA
- GET `users/{id}`: List user with given id from fakeAPI.json --> DATA
- GET `users/{*}[name]` : List all users and displays name only
- GET `users/{dip}[name]: Object` : List users with given dip - department id as Object
- GET `departments/{*}[department]: Array`: List all departments with names as Array

### POST

`http://localhost:4000/systemtest/createUser`

```json
"POST": {
    "createUser": {
        "result": { "message": "created" },
        "where": "users/{*}",
        "body": {
            "id": 1,
            "name": "name",
            "lastName": "lastName"
        }
    }
}

```

- Post body should include all properties, and extra properties are optional
- Where defines which section of data to add new data

### PUT

`http://localhost:4000/systemtest/users/1/lastname/Onder`

```json
"PUT": {
        "users/{dip}/lastname/{lastName}": {
            "result": { "message": "updated" },
            "where": "users/{dip,lastName}",
            "body": {
                "name": "updated name"
            }
        }
    },
```

- Updates names of users who work for IT department and last name is Onder

### DELETE

`http://localhost:4000/systemtest/users/1/lastname/Onder`

```json
"DELETE": {
        "users/{dip}/lastname/{lastName}": {
            "result": { "message": "updated" },
            "where": "users/{dip,lastName}",
        }
    },
```

- Deletes users who work for IT department and last name is Onder

### OTHER RESPONSES

in order to make 404 etc responses, create a section under `ERROR` in **fakeAPI.json** as,

```json
"404": {
            "code": "404",
            "messages": [
                {
                    "type": "Error",
                    "message": "Invalid Id"
                }
            ]
      }
```

then request it for example like `/path:404`

### REQUEST EXAMPLES

```js
// FETCH

fetch("http://localhost:4000/systemtest/all")
  .then((res) => res.json())
  .then((res) => console.log(res));

const credentials = "sinan:password";
fetch("http://localhost:4000/systemtest/authenticate", {
  headers: new Headers({
    Authorization: "Basic " + btoa(credentials),
  }),
})
  .then((res) => res.json())
  .then((res) => console.log(res));

fetch("http://localhost:4000/systemtest/createUser", {
  method: "POST",
  body: JSON.stringify({
    id: 6,
    name: "new user",
    lastName: "new lastName",
  }),
})
  .then((res) => res.json())
  .then((res) => console.log(res));

fetch("http://localhost:4000/systemtest/updateUser/2", {
  method: "PUT",
  body: JSON.stringify({
    name: "name1",
    lastName: "lastName1",
    password: "password1",
  }),
})
  .then((res) => res.json())
  .then((res) => console.log(res));

fetch("http://localhost:4000/systemtest/deleteUser/1", {
  method: "DELETE",
})
  .then((res) => res.json())
  .then((res) => console.log(res));

//AXIOS

axios("http://localhost:4000/systemtest/all").then((res) =>
  console.log(res.data)
);

const credentials = "sinan:password";
axios("http://localhost:4000/systemtest/authenticate", {
  headers: {
    Authorization: "Basic " + btoa(credentials),
  },
}).then((res) => console.log(res.data));

axios
  .post("http://localhost:4000/systemtest/createUser", {
    id: 7,
    name: "new user",
    lastName: "new lastName",
  })
  .then((res) => console.log(res.data));

axios
  .put("http://localhost:4000/systemtest/updateUser/2", {
    name: "name1",
    lastName: "lastName1",
    password: "password1",
  })
  .then((res) => console.log(res.data));

axios({
  method: "delete",
  url: "http://localhost:4000/systemtest/deleteUser/1",
});
```

### AUTHENTICATION

`/authenticate`

Basic Authentication is supported. In order to add/remove/update username and password of a user, see
`DATA.users` section

`http://localhost:4000/systemtest/authenticate`

It will return user info on success, including tokens field.
`tokens[0].auth` is a JWT token that you should send on each request as `Authorization` header
with value of `'Bearer ' + tokens[0].auth`

```
"tokens": [	
		{
	    	   "auth": ""
		}	
	]
```

`/signout`
In order to sign out, just add Authorization header and make the request. A successfull response will be

```json
{"Signout successfully"}
```

`/refresh`
In order to refresh your token, just add Authorization header and make the request. A successfull response will be

```json
{"tokens":[{"auth":"eyJ0eXAi...","expiration":720}],"session":"","referenceId":"","status":""}
```

### HEADERS

You can force each api to use certain headers on each request thru `SETTING.headers`

### FUNCTIONS

If you need more complicated process to manupulate the data, you may use functions feature.
It works only on `GET` and `POST`


Example

- Create a function on **functions.js** like `test`

Any function takes 2 paramaters, data and params. All query and body parameters will be included.


```js
const Functions = {
    test: (data, params) => {
        return `siteId ${params.siteId}`
    },
    testpost: (data, params) => {
        return `START DATE ${params.startDate} for EMPLOYEE employeeId ${params.employeeId}`
    }
}

module.exports = Functions;
```

- on GET request modify endpoints like this on file **fakeAPI.json**
```js
...
"GET": {
        "testfunc/{siteId}": {
            "function": "test"
        },
...
```

- on POST request modify endpoints like this on file **fakeAPI.json**
```js
...
"POST": {
"jobs/testpost/{employeeId}": {
            "function": "testpost",
            "body": {
                "startDate": "2021-02-18",
            }
        },
...


```

### POSTMAN

![](https://i.ibb.co/KzHjhKR/Screen-Shot-2022-09-01-at-12-37-11-AM.png)


You can automatically convert all APIs to postman collection with environment variables.
You will need one of the environment variables at least.

- Postman Collection
- Local Environment Variables
- Development Environment Variables

### CLOUD

`Set up on a AWS VM`

- Create an EC2 linux VM
- Install Node
- Create a folder named `fakeapiexample`
- `npm init` to create the package.json
- Install simpleake api package from a zip file or from repo
- Create **fakeAPI.json** file and copy content from example content on this README file `vim fakeAPI.json`
- go to service folder `cd /lib/systemd/system`
- create service file `vim fakeapi.service`
- Paste content below

```
[Unit]
Description=Simple fake API service
Documentation=https://www.npmjs.com/package/simplefakeapi
After=network.target

[Service]
Environment=NODE_PORT=4000
Type=simple
User=ubuntu
ExecStart=/usr/bin/script.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

- Go to `/usr/bin/` `cd /usr/bin/`
- Create a shell file for service to use `vim script.sh`
- Copy content below;

```sh
#!/bin/bash
cd /home/ubuntu/fakeapiexample
set +e
/home/ubuntu/.nvm/versions/node/v18.3.0/bin/npx fakeapi
set -e
```
- systemctl daemon-reload
- systemctl start fakapi
- systemctl status fakapi
- Open the port 4000 of VM

## Author

- Salih Onder | [salihonderx@gmail.com](mailto:salihonderx@gmail.com)

## License

[MIT](./LICENSE)
