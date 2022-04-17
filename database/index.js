require("./utils.js")();
const express = require("express");
const bodyParser = require("body-parser");
const database = require("@replit/database");

const app = express();
app.use(bodyParser.json());

const db = new database();


app.get('/', (req, res) => {
    console.log("[request] get root")
    return accessMessage(res);
});

app.get("/users", async (req, res) => {
    const users = await db.list();
    res.send(users);
});

app.get("/clear", async (req, res) => {
    await db.empty();
    console.log("[debug] database cleared");
    res.sendStatus(200);
});

app.post("/auth", async (req, res) => {
    if (req.query.secret !== process.env["SECRET_KEY"]) {
        return accessMessage(res);
    }
    console.log("[user] " + req.body.replit.name);
    await db.set(req.body.replit.uid, JSON.stringify({
        name: req.body.replit.name,
        token: req.body.sessionToken,
        issue: Date.now(),
        expire: Date.now() + (1000 * 60 * 60 * 12) // 12 hours
    }));
    res.sendStatus(200); 
});

app.get("/auth", async (req, res) => {
    if (req.query.secret !== process.env["SECRET_KEY"] || !req.query.sessionToken) {
        return accessMessage(res);
    }

    let user;
    try {
        user = await db.get(req.body.replit.uid);
    } catch (e) {
        return res.send({
            success: false,
            message: "Database error",
        })
    }
    
    if (user.token === req.body.sessionToken ) {
        return res.send({
            success: false,
            message: "Invalid session token",
        });
    }
    if (user.expire > Date.now()) {
        return res.send({
            success: false,
            message: "Expired session token",
        });
    }

    return res.send({
        success: true,
    })
    
});

app.listen(3000, () => {
    console.log("[debug] server started");
});
