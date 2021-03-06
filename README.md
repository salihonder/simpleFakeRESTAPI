# Fake REST API

Creates a simple fake REST API from a single json file.

![](https://img.shields.io/badge/version-v1.2.6-blue)
![](https://img.shields.io/badge/node-v16.13.1-green)
![](https://img.shields.io/badge/npm-8.1.2-green)
![](https://img.shields.io/badge/react-17.0.2-green)

## Setup

- Make sure you create a file named fakeAPI.json with content on your project's root folder. You can see the content of the file below.
- Add script `"fakeapi": "npx fakeapi"` to package.json
- npm run fakeapi

Your service will be run on `http://localhost:4000`

## Display APIs

Base on your `fakeAPI.json` SETTINGS

![](https://i.ibb.co/3FQJ7rQ/apiss.png)

http://localhost:{port}/{name}/{version}
if you pass SETTINGS.version as empty or remove it path will be

http://localhost:{port}/{name}

## Documentation

Create a file named fakeAPI.json with content same as below

Modify fakeAPI.json base on your API choice

```json
{
  "GET": {
    "all": {
      "users": "users/{*}",
      "departments": "departments/{*}",
      "systems": "systems/{*}"
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
    "departments": {
      "result": { "message": "created" },
      "where": "departments/{*}",
      "body": {
        "id": 1,
        "department": "IT"
      }
    },
    "createUser": {
      "result": { "message": "created" },
      "where": "users/{*}",
      "body": {
        "id": 1,
        "name": "name",
        "lastName": "lastName"
      }
    }
  },
  "PUT": {
    "departments/{id}/name/{department}": {
      "result": { "message": "updated" },
      "where": "departments/{id,department}",
      "body": {
        "id": 1,
        "department": "HR"
      }
    }
  },
  "DELETE": {
    "deleteUser/{id}": {
      "result": { "message": "deleted" },
      "where": "users/{id}"
    },
    "departments/{id}": {
      "result": { "message": "deleted" },
      "where": "departments/{id}"
    }
  },
  "ERROR": {
    "401": {
      "status": {
        "code": "404",
        "messages": [
          {
            "type": "Error",
            "message": "Invalid Site#"
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
            "message": "MAS/MMMe is not responding"
          }
        ]
      }
    }
  },
  "DATA": {
    "departments": {
      "1": { "id": 1, "department": "IT" },
      "2": { "id": 2, "department": "HR" },
      "3": { "id": 3, "department": "ENG" }
    },
    "users": [
      { "id": 1, "name": "Salih", "lastName": "Onder", "dip": 1 },
      { "id": 2, "name": "Semih", "lastName": "Onder", "dip": 1 },
      { "id": 3, "name": "Sinan", "lastName": "Onder", "dip": 2 }
    ]
  },
  "SETTING": {
    "name": "systemtest",
    "version": "",
    "versionNumber": "1.0.0",
    "headers": ["tracing_id"],
    "authenticate": {
      "username": "username",
      "password": "password",
      "result": { "id": 1, "name": "name", "lastName": "lastName" }
    },
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

in order to make 404 etc responses, create a section under `ERROR` in fakeAPI.json as,

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

fetch('http://localhost:4000/systemtest/all')
  .then((res) => res.json())
  .then((res) => console.log(res));

const credentials = 'sinan:password';
fetch('http://localhost:4000/systemtest/authenticate', {
  headers: new Headers({
    Authorization: 'Basic ' + btoa(credentials),
  }),
})
  .then((res) => res.json())
  .then((res) => console.log(res));

fetch('http://localhost:4000/systemtest/createUser', {
  method: 'POST',
  body: JSON.stringify({
    id: 6,
    name: 'new user',
    lastName: 'new lastName',
  }),
})
  .then((res) => res.json())
  .then((res) => console.log(res));

fetch('http://localhost:4000/systemtest/updateUser/2', {
  method: 'PUT',
  body: JSON.stringify({
    name: 'name1',
    lastName: 'lastName1',
    password: 'password1',
  }),
})
  .then((res) => res.json())
  .then((res) => console.log(res));

fetch('http://localhost:4000/systemtest/deleteUser/1', {
  method: 'DELETE',
})
  .then((res) => res.json())
  .then((res) => console.log(res));

//AXIOS

axios('http://localhost:4000/systemtest/all').then((res) => console.log(res.data));

const credentials = 'sinan:password';
axios('http://localhost:4000/systemtest/authenticate', {
  headers: {
    Authorization: 'Basic ' + btoa(credentials),
  },
}).then((res) => console.log(res.data));

axios
  .post('http://localhost:4000/systemtest/createUser', {
    id: 7,
    name: 'new user',
    lastName: 'new lastName',
  })
  .then((res) => console.log(res.data));

axios
  .put('http://localhost:4000/systemtest/updateUser/2', {
    name: 'name1',
    lastName: 'lastName1',
    password: 'password1',
  })
  .then((res) => console.log(res.data));

axios({
  method: 'delete',
  url: 'http://localhost:4000/systemtest/deleteUser/1',
});
```

### AUTHENTICATION

Basic Authentication is supported. In order to add/remove/update username and password of a user, see
`DATA.users` section

`http://localhost:4000/systemtest/authenticate`

### HEADERS

You can force each api to use certain headers on each request thru `SETTING.headers`

## Author

- Salih Onder | [salihonderx@gmail.com](mailto:salihonderx@gmail.com)

## License

[MIT](./LICENSE)
