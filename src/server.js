require("dotenv").config();
const app = require("./config/app");

const PORT = 3005;

app.listen(PORT, "localhost", (err) => {
  if (!err) {
    console.log(`Server is listening to port: ${PORT}`);
    console.log(`Browse: http://localhost:${PORT}`);
    console.log("Press CTRL+C to disconnect server");
  }
});
