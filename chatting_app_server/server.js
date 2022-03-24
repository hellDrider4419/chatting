const express = require("express");
const app = express();
const multer = require("multer");
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
} = require("./pgconfig");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

app.options(
  "*",
  cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 })
);
app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(
  bodyParser.json({ limit: 1024 * 1024 * 100, type: "application/json" })
); // to support JSON-encoded bodies

app.use("/images", express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: 1024 * 1024 * 100,
    type: "application/x-www-form-urlencoded",
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).array("file");

app.use(async function (req, res) {
  let result = "";
  switch (req.url) {
    case "/addNewUser":
      result = await SignupQuery(req.body);
      break;
    case "/loginUser":
      result = await loginQuery(req.body);
      break;
    case "/createNewRoom":
      result = await CreateNewRoomQuery(req.body);
      break;
    case "/getUserDetails":
      result = await getUserDetailsQuery(req.body);
      break;
    case "/getAllUserList":
      result = await GetAllUserListquery(req.body);
      break;
    case "/getUserRoomList":
      result = await GetUserRoomIDsQuery(req.body);
      break;
    case "/uploadImage":
      upload(req, res, (err) => {
        if (err) {
          result = { error: err };
        }
        result = "success";
      });

      break;
    default:
      result = "url not found";
      break;
  }
  res.send(result);
});

io.on("connection", (socket) => {
  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    AddNewMessage(data).then((res) =>
      io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, res)
    );
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
