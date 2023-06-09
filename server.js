const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["https://www.buddhistdiary.com", "https://n-b-back.vercel.app" ],
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: ["https://budd-font.vercel.app", "https://budd-back.herokuapp.com" ],
//     credentials: true,
//   })
// );

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static(path.join(__dirname + "/public")));

// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

// Routes
app.get("*", function(req, res)  {
  res.sendFile(
    path.join(__dirname, '/public', 'index.html' ),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

// app.get("/", (req, res) => {
//   res.send("Home Page");
// });

// Error Middleware
app.use(errorHandler);
// Connect to DB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
