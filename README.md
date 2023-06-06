# CS35L-PayUp

## Description
PayUp is a web application that keeps track of your expenses for you. Users can create an account, add friends, record transactions within a group with their friends, and view all their transactions at once. 

## Features
    1. User is able to create and login to an account. 
    2. Display dynamic data in the home page such as the user's transactions with their friends. 
    3. Search for friends to add or remove. 
    4. Upload information about transactions within a group of friends. 
    5. User is able to select from friends list to create transactions with them in a group.
    6. View information about their profile such as their unique username and email. 
    7. Calculate total running balance across all transactions. 
    8. Easy navigation through the homepage. 

## Running the App 
Run the following commands:
```
git clone https://github.com/stephk005/CS35L-PayUp.git

cd CS35L-PayUp
```

## Setting up the backend: 

Create a MongoDB account at https://cloud.mongodb.com/. Create a .env in the server directory, and write 'MONGO_DB_URI = YOUR_MONGO_DB_URI' to the file. 

```
cd server

npm install mongodb express cors dotenv

node server.mjs

```

## Set up frontend:
```
cd .. 

cd client

npm install 

npm install react-currency-input-field

npm start
```

You should see the website at http://localhost:3000 in the browser if the backend and frontend are set up correctly. 
