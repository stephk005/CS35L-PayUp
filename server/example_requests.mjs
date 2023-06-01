
// This file is just meant as a log of examples for how to interact with the database
// Make sure to check if your request went through properly by verifying the status codes

// STATUS CODES: Look at record.mjs for more details
// 200 or 201: SUCCESS
// 400: KEY_ERROR (database didn't receive proper keys from request, usually when creating items)
// 404: FETCH_ERROR (item you wanted to retrieve was not found)
// 500: DELETE_ERROR, INSERT_ERROR, POP_ERROR, CREATE_ERROR (internal database failure)




//=================================================================================================




// FETCHING ALL USERS
/*
const url = 'http://localhost:5050/record/user';

let result = await fetch(url); // When doing GET requests, don't need to pass anything else

if(result.ok) console.log(await result.json()); // Just need to check if request went through
else console.log("Error sending request");
*/


//=================================================================================================


// CREATING A NEW USER
/*
const url = 'http://localhost:5050/record/user/create';

let newUser = {
    username: "manualUser",
    password: "manualPassword",
    email: "manualEmail@email.com",
    groups: [],  // list of _id (groups)
    friends: [],  // list of _id (users)
    transactions: []  // list of _id (transactions)
  };


let result = await fetch(url, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'   // This needs to be included for proper parsing
    },
    body: JSON.stringify(newUser)
});

console.log(result.statusText);

if (result.status !== 201) console.log(await result.text());  // Logs errors
else {
    let user = await result.json();  // Converts to proper JS Object
    console.log(user);
}
*/


//=================================================================================================


// UPDATING USER GROUP LIST (INSERTING)
/*
const url = 'http://localhost:5050/record/user/insert/group/64747027de44f698f362aac2'; // Some user

let groupID = {id: "646c7707fcaaf1131b3a1536"};

let result = await fetch(url, {
    method: "PATCH",
    headers: {
        'Content-Type': 'application/json'   // This needs to be included for proper parsing
    },
    body: JSON.stringify(groupID)
});

console.log(result.status);

if(result.status !== 201) console.log("Error inserting group ID");
else {  // Print updated user document
    console.log("Successfully inserted!");

    let userURL = 'http://localhost:5050/record/user/64747027de44f698f362aac2'
    let res = await fetch(userURL);

    if(res.status === 200){
        let user = await res.json();
        console.log(user);
    } else console.log("Error fetching user");
}
*/


//=================================================================================================


// UPDATING USER GROUP LIST (POPPING) (Almost identical to inserting)
/*
const url = 'http://localhost:5050/record/user/pop/group/64747027de44f698f362aac2'; // Some user

let groupID = {id: "646c7707fcaaf1131b3a1536"};

let result = await fetch(url, {
    method: "PATCH",
    headers: {
        'Content-Type': 'application/json'   // This needs to be included for proper parsing
    },
    body: JSON.stringify(groupID)
});

console.log(result.status);

if(result.status !== 201) console.log("Error popping group ID");
else {  // Print updated user document
    console.log("Successfully popped!");

    let userURL = 'http://localhost:5050/record/user/64747027de44f698f362aac2'
    let res = await fetch(userURL);

    if(res.status === 200){
        let user = await res.json();
        console.log(user);
    } else console.log("Error fetching user");
}
*/


//=================================================================================================


// DELETING USER
/*
const url = 'http://localhost:5050/record/user/delete/64747071de44f698f362aac3';

let result = await fetch(url, {method: "DELETE"});

console.log(result.status); // Note: will return 200 even if user to delete isn't in database

if(result.status !== 200) console.log("Error deleting desired user");
else console.log("Successful deletion!");
*/