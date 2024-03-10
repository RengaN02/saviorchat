const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const { JsonDatabase } = require("wio.db");

const db = new JsonDatabase({
  databasePath: "./databases/database.json",
});
if(!db.get("messages")){ db.set("messages",[])}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", (socket) => {
  socket.on("letsconnect", (data) => {
    const olddatas = db.get("messages");
    olddatas.forEach(async (data) => {
      var msg = data.msg;
      var usr = data.user;

      io.emit("chat message", msg, usr);
    });
  });
  socket.on("chat message", (msg, usr) => {
    io.emit("chat message", msg, usr);
    var msgdata = {
      user: usr,
      msg: msg,
    };
    db.push("messages", msgdata);
  });
});

http.listen(port, () => {
  console.log(`Port [${port}]`);
});
