npm i 
npm start

POST localhost:3000/login
{
   "email": "mendeljacks@gmail.com",
   "password": "password"
}

POST localhost:3000/mutate
{
    "$operation": "create",
    "users": [{
            "email": "mendeljacks@gmail.com",
            "password": "password",
            "first_name": "Mendel",
            "last_name": "Jackson",
            "phone": "1234567890"
        }]
}


POST localhost:3000/query
{
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