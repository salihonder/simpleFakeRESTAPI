![](https://img.shields.io/badge/version-v1.0.0-blue)
![](https://img.shields.io/badge/node-v16.13.1-green)
![](https://img.shields.io/badge/npm-8.1.2-green)
![](https://img.shields.io/badge/react-17.0.2-green)

# Fake REST API

Creates a simple fake REST API from a single json file.

## Setup

- Make sure you have a fakeAPI.json on your project's root folder
- Add script `"fakeapi": "npx fakeapi"` to package.json
- npm run fakeapi

Your service will be run on `http://localhost:3000`

## Documentation

Modify fakeAPI.json

```json
{
  "GET": {
    "users": {
      "path": "users",
      "query": "users/*"
    },
    "user": {
      "path": "user/{id}",
      "query": "users/{id}"
    }
  },
  "POST": {
    "createUser": {
      "path": "createUser",
      "query": "users",
      "body": {
        "id": 1,
        "name": "",
        "lastName": ""
      }
    }
  },
  "PUT": {
    "updateUser": {
      "path": "updateUser",
      "query": "users/{id}",
      "body": {
        "id": 1
      }
    }
  },
  "DELETE": {
    "deleteUser": {
      "path": "deleteUser/{id}",
      "query": "users/{id}"
    }
  },
  "DATA": {
    "users": [
      { "id": 1, "name": "Salih", "lastName": "Onder" },
      { "id": 2, "name": "Semih", "lastName": "Onder" }
    ]
  },
  "SETTING": {
    "name": "api",
    "version": "v1",
    "port": 3000
  }
}
```

### QUERY

- GET `users/*`: Get all users from fakeAPI.json --> DATA
- GET `users/{id}`: Get user with given id from fakeAPI.json --> DATA
- POST `users`: Create a user on users using body on fakeAPI.json --> DATA
- PUT `users/{id}`: Update user with given id using body on fakeAPI.json --> DATA
- DELETE `users/{id}`: Delete user with given id from fakeAPI.json --> DATA

## Author

- Salih Onder | [salihonderx@gmail.com](mailto:salihonderx@gmail.com)

## License

[MIT](./LICENSE)
