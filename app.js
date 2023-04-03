require('dotenv').config();
require('./config/dbcon').connect();

const express = require('express');
const User = require('./model/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const app = express();



app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
   res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', "Content-Type");
   next();
})

//Login

app.post("/register", async (req, res) => {
   try {
      const { username, password, PIN } = req.body;

      if (!(username && password && PIN)) {
         res.status(400).send("ALL input is required");
      }

      const oldUser = await User.findOne({ username });
      if (oldUser) {
         return res.status(409).send("user already exit Please logon");
      }


      encryptedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
         username: username,
         password: encryptedPassword,
         PIN
      })

      const token = jwt.sign(
         { user_id: user._id, username },
         process.env.TOKEN_KEY,
         {
            expiresIn: "2h"
         }
      )

      user.token = token;
      res.status(201).json(user);

   } catch (err) {
      console.log(err);
   }
})

app.post("/login", async (req, res) => {
   try {
      const { username, password } = req.body;
      if (!(username && password)) {
         res.status(400).send("All input is requiresd");
      }

      const user = await User.findOne({ username });

      if (user && (await bcrypt.compare(password, user.password))) {

         const token = jwt.sign(
            { user_id: user._id, username },
            process.env.TOKEN_KEY,
            {
               expiresIn: "2h"
            }
         )
         user.token = token
         res.status(200).json(user);
      }

      res.status(400).send("Invalid Credntials")


   } catch (err) {
      console.log(err);
   }
})

app.get("/getTest", (req, res) => {
   res.status(201).json({ "asd": "asd", "qweqwe": "qwe" });
})

app.post("/welcome",auth,(req,res)=>{
   res.status(200).send("welcome");
})

app.get("/", auth, (req, res) => {
   res.status(200).json({ "YO": "M6" });
})

module.exports = app;