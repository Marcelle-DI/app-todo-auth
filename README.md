# APP-TODO-AUTH

An experimental project utilising a dockerised PERN stack. The project implements security features to minimise the [OWASP top 10 security risks](https://owasp.org/www-project-top-ten/) including:

    - ExpressJS Gateway
    - Auth0
    - express-validation
    - Object Level Authorisation definition
    - User Authentication and Authorisation
    - Limiting data property exposure
    - Log all failed authentication attempts, denied access, and input validation errors.

The final app architecture shall look like this:

![APP-TODO-AUTH ARCHITECTURE](/img/app-architecture.png)


---

## Setup requirements

Environment variables need to be declared for the following:

    - In the web folder: 
        - An API url declaration
        - Auth0 site key
    - In the server folder: 
        - Database connection variables
        - Auth0 secret key

---

### The react web client code is forked from [here](https://github.com/l0609890/pern-todo-app)

---

## Network Configuration

```
| Service      | Host Port    | Container Port |
| ------------ | ------------ | ------------   |
| web          | 3001         | 3000           |
| api server   | 5001         | 5000           |
| db           | 5433         | 5432           |
```

---

## Running the project

Start up the project by running:
```zsh
docker-compose up
```
