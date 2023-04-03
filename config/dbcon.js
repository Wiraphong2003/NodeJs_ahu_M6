const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {

   mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
   })
      .then(() => {
         console.log("Successfully connected ");
      }).catch((err) => {
         console.log("Errorr connected to database")
         console.log(err);
         process.exit(1);
      })
};