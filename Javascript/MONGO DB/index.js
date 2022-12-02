const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/testDb")
  .then(() => {
    console.log("Database is connected");
  })
  .catch((error) => {
    console.log("Error connecting to Database" + error);
  });

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  isMarried: Boolean,
  salary: Number,
  gender: String,
});

const User = mongoose.model("User", userSchema);
//storeInfo();
//fetchInformation();
updateInformation();
async function storeInfo() {
  const user = new User({
    name: "John",
    age: 20,
    isMarried: true,
    salary: 50000,
    gender: "male",
  });
  await user.save().then(() => {
    console.log("record saved successfully");
  });
}

// Comparison operator
/**
 * eq       -   equals
 * ne       - not equal
 * gt       - greater than
 * gte      - greater than equal to
 * lt       - lesser than
 * lte      - lesser than equals
 * in       -   in // get data in a collection
 * nin      = not in // not  in a collection
 * or       - logical or
 * and      - logical and
 */

// find records in mongo db
async function fetchInformation() {
  //const users = await User.find({}); // this will find all data
  const someUsers = await User.find({ name: "John" });
  const someUsersById = await User.findById("63775d21eee0ef0f5f4a3328"); // this will find all data
  const someUsers2 = await User.find({})
    .select("name age")
    .sort("-name")
    .limit(2)
    .count(); // "-name" for descinding order
  const someUsers3 = await User.find({ name: "John" }).select("-name -age");
  const someUsers4 = await User.find({ age: { $gt: 10 } }); //where age greather tthan 20
  const someUsers5 = await User.find({
    salary: { $in: [10000, 50000, 25000] },
  }); //where age greather tthan 20

  const someUsers6 = await User.find(
    { age: { $gt: 10 } } && { name: { $ne: "John" } }
  ); //where age greather tthan 20 and name=john

  const someUsers66 = await User.find({ age: { $gt: 10 } }).or({
    name: { $ne: "John" },
  });
  const someUsers7 = await User.find({ age: { $gt: 10 } }).or([
    { name: { $eq: "John" } },
    { salary: { $gte: 50000 } },
  ]);

  // advanced query
  // and
  const someUsers71 = await User.find({
    name: { $eq: "John" },
    salary: { $gte: 50000 },
  });

  // or
  const someUsers72 = await User.find({}).or([
    { name: { $eq: "John" } },
    { salary: { $gte: 50000 } },
  ]);

  console.log(someUsers72);
}

// query API functions

// Update records in mongo db
async function updateInformation() {
  //const users = await User.find({}); // this will find all data
  const someUsers = await User.findById("63775d21eee0ef0f5f4a3328");
  someUsers.name = "Terry";
  someUsers.age = 50;
  await someUsers.save(); // this will save the update
  //console.log(someUsers);

  // way two
  const someUsers2 = await User.findByIdAndUpdate("63775d21eee0ef0f5f4a3328", {
    salary: 80000,
    isMarried: false,
  });
  // additional options
  const someUsers23 = await User.findByIdAndUpdate(
    "63775d21eee0ef0f5f4a3328",
    {
      salary: 80000,
      isMarried: false,
    },
    { new: true, runValidators: true } // validate the entries using the schema
  );
  console.log(someUsers2);
}

async function deleteRecord() {
  await User.deleteOne({ _id: "63775d21eee0ef0f5f4a3328" });
  await User.deleteMany({ age: 80000 });
  const user1 = await User.findById("63775d21eee0ef0f5f4a3328");
  await user.delete();

  // or
  const user2 = await User.findByIdAndDelete("63775d21eee0ef0f5f4a3328");
}
// Comparison operator
/**
 * eq       -   equals
 * ne       - not equal
 * gt       - greater than
 * gte      - greater than equal to
 * lt       - lesser than
 * lte      - lesser than equals
 * in       -   in
 * nin      = not in
 *
 */
