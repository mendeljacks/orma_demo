npm i 
npm start
ensure env.json present at root level

```javascript
// Login an existing user
// POST localhost:3000/login
const body = {
   "email": "mendeljacks@gmail.com",
   "password": "password"
}

// Make a mutation to the database
// POST localhost:3000/mutate
const body = {
    "$operation": "create",
    "users": [{
            "email": "mendeljacks@gmail.com",
            "password": "password",
            "first_name": "Mendel",
            "last_name": "Jackson",
            "phone": "1234567890"
        }]
}


// Make a query to the database
// POST localhost:3000/query
const body = {
            "users": {
                "id": true,
                "email": true,
                "password": true,
                "first_name": true,
                "last_name": true,
                "phone": true,
                "created_at": true,
                "updated_at": true
            }
        }
```
