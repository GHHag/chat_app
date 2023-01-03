const db = require('./db');

let connections = [];

const sse = async (req, res) => {
    // Add the response to open connections
    connections.push(res);

    // listen for client disconnection
    // and remove the client's response
    // from the open connections list
    req.on('close', () => {
        connections = connections.filter(openRes => openRes != res)

        // message all open connections that a client disconnected
        broadcast('disconnect', {
            message: 'client disconnected'
        });
    });

    // Set headers to mark that this is SSE
    // and that we don't close the connection
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    });

    // message all connected clients that this 
    // client connected
    broadcast('connect', {
        message: 'clients connected: ' + connections.length
    });
}

// function to send message to all connected clients
function broadcast(event, data) {
    // loop through all open connections and send
    // some data without closing the connection (res.write)
    for (let res of connections) {
        // syntax for a SSE message: 'event: message \ndata: "the-message" \n\n'
        res.write('event:' + event + '\ndata:' + JSON.stringify(data) + '\n\n');
    }
}

/* app.post('/login', (req, res) => {
    if (!acl('login', req)) {
        res.status(405);
        res.json({ _error: 'Not allowed' });
    }
    req.body[passwordField] =
        passwordEncryptor(req.body[passwordField]);
    let stmt = db.prepare(`
      SELECT * FROM customers
      WHERE email = :email AND password = :password
    `);
    let result = stmt.all(req.body)[0] || { _error: 'No such user.' };
    delete result.password;
    if (!result._error) {
        req.session.user = result;
    }
    res.json(result);
});

app.get('/login', (req, res) => {
    if (!acl('login', req)) {
        res.status(405);
        res.json({ _error: 'Not allowed' });
    }
    res.json(req.session.user || { _error: 'Not logged in' });
});

app.delete('/login', (req, res) => {
    if (!acl('login', req)) {
        res.status(405);
        res.json({ _error: 'Not allowed' });
    }
    delete req.session.user;
    res.json({ success: 'logged out' });
}); */

const createUser = async (req, res) => {
    if (!req.body.userName || !req.body.password || !req.body.userRole) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    try {
        //const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        const query = await db.query(
            `
                INSERT INTO users (user_name, user_password, user_role) 
                VALUES($1, $2, $3)
                RETURNING *
            `,
            [req.body.userName, req.body.password, req.body.userRole]
        );

        if (query.rows.length === 0) {
            return res.status(403);
        }
        const user = query.rows[0];
        console.log(user);
        console.log(user.id);
        console.log(user.user_name);
        console.log(user.user_role);

        req.session.user = {
            id: user.id,
            userName: user.user_name,
            userRole: user.user_role,
        }

        res.status(200).json({ success: true, user: req.session.user });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const loginUser = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const blockUser = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChats = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const createChat = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const inviteToChat = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const acceptChatInvite = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const banFromChat = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}


const sendMessage = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChatMessages = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const deleteMessage = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

/* const x = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
} */

module.exports = {
    sse,
    createUser,
    loginUser,
    blockUser,
    getChats,
    createChat,
    inviteToChat,
    acceptChatInvite,
    banFromChat,
    sendMessage,
    getChatMessages,
    deleteMessage
}