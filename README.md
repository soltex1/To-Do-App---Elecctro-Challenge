# To-Do-App---Elecctro-Challenge

# 
**DEMO:** https://serene-chamber-89901.herokuapp.com/

![](http://imgur.com/oODRN76.gif)

## Brief Description:

Simple To-Do application using Node, Hapi.js framework (https://hapijs.com), and MongoDB. There is a very simple hardcoded login based on hapi-auth-cook https://github.com/hapijs/hapi-auth-cookie.

## Dependencies and Versions:

**MongoDB:** 3.4.4

**Angular/CLI:** 1.0.3

**NodeJS:** 7.10.0

**HapiJS:** 4.2.0

For more information about dependencies, please see the file package.json.

## API End-Points

```
GET /todos?filter=<STATE>&orderBy=<FIELD>
PUT /todos
PATCH /todo/{id}
DELETE /todo/{id}
```

Auto-Generated server documentation using *lout* plugin (https://github.com/hapijs/lout):

<img src="http://imgur.com/0J4rf0F.png" alt="Route Documentation" width="500" height="450"/>

## Ĺogin Details

``
account 01) username: john and password: password;
account 02) username: john2 and password: password;
``

## How To Run:

```
node server or NODE_ENV 'production' node server
```

NODE_ENV 'production' will use a different database configuration instead of the local one, you must set the environment variables.