const db = require('./db');
const passwordEncryptor = require('../../security/passwordEncryptor');
const acl = require('../../security/acl');

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
    console.log('broadcast event,', data);
    // loop through all open connections and send
    // some data without closing the connection (res.write)
    for (let res of connections) {
        // syntax for a SSE message: 'event: message \ndata: "the-message" \n\n'
        res.write('event:' + event + '\ndata:' + JSON.stringify(data) + '\n\n');
    }
}

const registerUser = async (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.userRole) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const hashedPassword = passwordEncryptor(req.body.password);
        const query = await db.query(
            `
                INSERT INTO users (username, user_password, user_role) 
                VALUES($1, $2, $3)
                RETURNING *
            `,
            [req.body.username, hashedPassword, req.body.userRole]
        );

        if (query.rows.length === 0) {
            return res.status(403);
        }
        const user = query.rows[0];

        req.session.user = {
            id: user.id,
            username: user.username,
            userRole: user.user_role,
        }

        res.status(200).json({ user: req.session.user });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const loginUser = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const query = await db.query(
            `
                SELECT id, username, user_role, user_password
                FROM users
                WHERE username = $1
            `,
            [req.body.username]
        );

        if (query.rows.length === 0) {
            res.status(403).json({ success: false, error: 'User not found' });
            return;
        }
        const user = query.rows[0];

        const correctPassword = passwordEncryptor(req.body.password) === user.user_password;
        if (!correctPassword) {
            res.status(403).json({ success: false, error: 'Incorrect password' });
            return;
        }

        req.session.user = {
            id: user.id,
            userName: user.username,
            userRole: user.user_role,
        }

        res.status(200).json({ user: req.session.user });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getLoggedInUser = async (req, res) => {
    console.log(req.session.user);
    console.log(req.route.path);
    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    if (req.sessionID && req.session.user) {
        res.status(200).json({ user: req.session.user });
    }
    else {
        res.status(403).json({ success: false });
    }
}

const logoutUser = async (req, res) => {
    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await req.session.destroy();
        res.status(200).json({ success: true, result: 'Logged out' });
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
}

const blockUser = async (req, res) => {
    if (!req.params.id) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await db.query(
            `
                INSERT INTO user_blockings(user_id, blocked_user_id)
                VALUES ($1, $2)
            `,
            [req.session.user.id, req.params.id]
        );

        res.status(200).json({ success: true, result: 'User blocked' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChats = async (req, res) => {
    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const query = await db.query(
            `
                SELECT *
                FROM chats, chat_users
                WHERE chats.id = chat_users.chat_id
                AND chat_users.user_id = $1
                AND chat_users.invitation_accepted = true
            `,
            [req.session.user.id]
        );

        res.status(200).json({ success: true, result: query.rows });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const createChat = async (req, res) => {
    if (!req.body.subject) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await db.query(
            `
                INSERT INTO chats (created_by, chat_subject)
                VALUES ($1, $2)
            `,
            [req.session.user.id, req.body.subject]
        );

        res.status(200).json({ success: true, result: 'Chat created' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const inviteToChat = async (req, res) => {
    if (!req.query.chatId || !req.query.userId) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await db.query(
            `
                INSERT INTO chat_users (chat_id, user_id)
                VALUES ($1, $2)
            `,
            [req.query.chatId, req.query.userId]
        );

        res.status(200).json({ success: true, result: 'Chat invite sent' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChatInvites = async (req, res) => {
    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const query = await db.query(
            `
                SELECT *
                FROM chat_users
                WHERE user_id = $1
                AND invitation_accepted = false
            `,
            [req.session.user.id]
        );

        res.status(200).json({ success: true, result: query.rows });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const acceptChatInvite = async (req, res) => {
    if (!req.params.id) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await db.query(
            `
                UPDATE chat_users
                SET invitation_accepted = true
                WHERE chat_id = $1
                AND user_id = $2
            `,
            [req.params.id, req.session.user.id]
        );

        res.status(200).json({ success: true, result: 'Chat invitation accepcted' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const banFromChat = async (req, res) => {
    if (!req.query.chatId || !req.query.userId) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await db.query(
            `
                UPDATE chat_users
                SET banned = true
                WHERE chat_id = $1
                AND user_id = $2
            `,
            [req.query.chatId, req.query.userId]
        );

        res.status(200).json({ success: true, result: 'User banned from chat' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}


const sendMessage = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        let message = req.body;
        message.timestamp = Date.now();
        broadcast('new-message', message);
        res.send('ok');
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChatMessages = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
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
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
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

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
} */

module.exports = {
    sse,
    registerUser,
    loginUser,
    getLoggedInUser,
    logoutUser,
    blockUser,
    getChats,
    createChat,
    inviteToChat,
    getChatInvites,
    acceptChatInvite,
    banFromChat,
    sendMessage,
    getChatMessages,
    deleteMessage
}