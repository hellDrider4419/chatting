const multer = require("multer");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  AddNewMessage,
  loginQuery,
  SignupQuery,
  getUserDetailsQuery,
  CreateNewRoomQuery,
  GetAllUserListquery,
  GetUserRoomIDsQuery,
  updateAboutQuery,
} = require("./pgconfig");
const { uploadFiles } = require("./saveFiles");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
let storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
let upload = multer({ storage: storage });
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "https://chatapp.hopto.org");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Pass to next layer of middleware
//   next();
// });

app.options(
  "*",
  cors({ origin: "https://chatapp.hopto.org", optionsSuccessStatus: 200 })
);
app.use(
  cors({ origin: "https://chatapp.hopto.org", optionsSuccessStatus: 200 })
);
app.use(
  bodyParser.json({ limit: 1024 * 1024 * 100, type: "application/json" })
); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: 1024 * 1024 * 100,
    type: "application/x-www-form-urlencoded",
  })
);

app.use("/images", express.static("public/images"));
app.get("/getAllUserList", async function (req, res) {
  res.send(await GetAllUserListquery(req.body));
});
app.post("/updateAbout", upload.array("files"), function (req, res) {
  req.body.profilePic = req.files[0].filename;
  updateAboutQuery(req.body);
  res.send("updated");
});
app.post("/addNewUser", async function (req, res) {
  res.send(await SignupQuery(req.body));
});
app.post("/loginUser", async function (req, res) {
  res.send(await loginQuery(req.body));
});
app.post("/createNewRoom", async function (req, res) {
  res.send(await CreateNewRoomQuery(req.body));
});
app.post("/getUserDetails", async function (req, res) {
  res.send(await getUserDetailsQuery(req.body));
});
app.post("/getUserRoomList", async function (req, res) {
  res.send(await GetUserRoomIDsQuery(req.body));
});

io.on("connection", (socket) => {
  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    data.body.file = data.body.file.map((file) => uploadFiles(file));
    AddNewMessage(data.body).then((res) =>
      io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, res)
    );
  });

  // socket.on("updatedProfileInfo", (data) => {
  //   console.log(data.body);
  //   io.emit("updatedProfileInfo", data.body);
  //   // AddNewMessage(data.body).then((res) => io.emit("updatedProfileInfo", res));
  // });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Listening on port ${PORT}`);
});
