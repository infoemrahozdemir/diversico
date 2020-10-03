// array in local storage for registered users
const intialUsers = [
    { id: 1, username: 'user1', password: 'pass1', firstName: 'Cade',   lastName: 'Lambert',    token: 'fake-jwt-token', image: 'https://randomuser.me/api/portraits/men/1.jpg'},
    { id: 2, username: 'user2', password: 'pass2', firstName: 'Bronwyn',lastName: 'Mitchell',   token: 'fake-jwt-token', image: 'https://randomuser.me/api/portraits/men/2.jpg'},
    { id: 3, username: 'user3', password: 'pass3', firstName: 'Nico',   lastName: 'Boone',      token: 'fake-jwt-token', image: 'https://randomuser.me/api/portraits/men/3.jpg'},
    { id: 4, username: 'user4', password: 'pass4', firstName: 'Alison', lastName: 'Mcneill',    token: 'fake-jwt-token', image: 'https://randomuser.me/api/portraits/men/4.jpg'},
    { id: 5, username: 'user5', password: 'pass5', firstName: 'Forrest',lastName: 'Woodard',    token: 'fake-jwt-token', image: 'https://randomuser.me/api/portraits/men/5.jpg'},
    { id: 6, username: 'user6', password: 'pass6', firstName: 'Arsalan',lastName: 'Marsh',      token: 'fake-jwt-token', image: 'https://randomuser.me/api/portraits/men/6.jpg'},
    { id: 7, username: 'user7', password: 'pass7', firstName: 'Hailie', lastName: 'Crossley',   token: 'fake-jwt-token', image: 'https://randomuser.me/api/portraits/men/7.jpg'},
    { id: 8, username: 'user8', password: 'pass8', firstName: 'Tomasz', lastName: 'Puckett',    token: 'fake-jwt-token', image: 'https://randomuser.me/api/portraits/men/8.jpg'},
    { id: 9, username: 'user9', password: 'pass9', firstName: 'Johan',  lastName: 'Cannedy',    token: 'fake-jwt-token', image: 'https://randomuser.me/api/portraits/men/9.jpg'},
];


let users = JSON.parse(localStorage.getItem('users')) || intialUsers;
let messages = JSON.parse(localStorage.getItem('messages')) || [
    {userId: 3, message:'falan filan inter milan', datetime: new Date().toISOString() },
    {userId: 1, message:'falan filan inter milan', datetime: new Date().toISOString() },
    {userId: 2, message:'falan filan inter milan', datetime: new Date().toISOString() },
    {userId: 1, message:'falan filan inter milan', datetime: new Date().toISOString() },
    {userId: 4, message:'falan filan inter milan', datetime: new Date().toISOString() },
];
    
export function configureFakeBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {

                // authenticate
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
                    // get parameters from post request
                    let params = JSON.parse(opts.body);
                    // find if any user matches login credentials
                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });

                    if (filteredUsers.length) {
                        // if login details are valid return user details and fake jwt token
                        let user = filteredUsers[0];
                        let responseJson = {
                            id: user.id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            image: user.image,
                            token: 'fake-jwt-token'
                        };
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson)) });
                    } else {
                        // else return error
                        reject('Username or password is incorrect');
                    }

                    return;
                }

                // get users
                if (url.endsWith('/users') && opts.method === 'GET') {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(users))});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // get user by id
                if (url.match(/\/users\/\d+$/) && opts.method === 'GET') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedUsers = users.filter(user => { return user.id === id; });
                        let user = matchedUsers.length ? matchedUsers[0] : null;

                        // respond 200 OK with user
                        resolve({ ok: true, text: () => JSON.stringify(user)});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // get messages
                if (url.endsWith('/messages') && opts.method === 'GET') {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(messages))});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));

            }, 500);
        });
    }
}