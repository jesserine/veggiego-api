const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: true }));

const admin = require("firebase-admin");
var serviceAccount = require("./veggiego-d20b9-firebase-adminsdk-p6xk6-e7d845a59e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://veggiego-d20b9-default-rtdb.asia-southeast1.firebasedatabase.app",
});
const db = admin.database();

// @desc    Create new test
// @route   POST /api/createlist
app.post("/api/createlist", async (req, res) => {
  const test = req.body;
  await db.ref("test2").push(test);
  res.status(200).send(JSON.stringify(test));
});

app.get("/hello", async (req, res) => {
  res.status(201).send(JSON.stringify("hello world"));
});

// @desc    Fetch all test
// @route   GET /api/testlist
app.get("/api/testlist", async (req, res) => {
  const snapshot = await db.ref("test");
  snapshot.on("value", (snapshot) => {
    const test = snapshot.val();
    const testList = [];
    for (let id in test) {
      testList.push(test[id]);
    }
    res.status(200).send(JSON.stringify(testList));
  });
});

// @desc    Get rider profile
// @route   GET /getRiderProfile/:number
app.get("/api/getRiderProfile/:number", async (req, res) => {
  const riderNumber = req.params.number;
  const snapshot = await db.ref(`riders`);
  snapshot.on("value", (snapshot) => {
    const riderDetails = [];
    const riders = snapshot.val();
    for (let id in riders) {
      if (riders[id].riderContactNum == riderNumber) {
        riderDetails.push(riders[id]);
      }
    }
    res.status(200).send(JSON.stringify(riderDetails));
  });
});

// @desc    Fetch single test
// @route   GET /api/testlist/:id
app.get("/api/testlist/:id", async (req, res) => {
  const paramId = req.params.id;
  const snapshot = await db.ref(`test/${paramId}`);
  snapshot.on("value", (snapshot) => {
    const test = snapshot.val();
    const testList = [];
    for (let id in test) {
      testList.push(test[id]);
    }
    res.status(200).send(JSON.stringify(testList));
  });
});

// @desc    Update a test
// @route   PUT /api/updatelist/:id
app.put("/api/updatelist/:id", async (req, res) => {
  const body = req.body;
  const paramId = req.params.id;
  await db.ref(`test/${paramId}`).update(body);
  res.status(200).send(JSON.stringify(body));
});

// @desc    Delete a test
// @route   DELETE /api/deletelist/:id
app.delete("/api/deletelist/:id", async (req, res) => {
  const paramId = req.params.id;
  await db.ref(`test/${paramId}`).remove();

  res.status(200).send(JSON.stringify("removed"));
});

// @desc    Get all rider orders
// @route   DELETE /api/getRiderOrders/:number
app.get("/api/getRiderOrders/:number", async (req, res) => {
  const riderNumber = req.params.number;
  const snapshot = await db.ref(`orders`);
  snapshot.on("value", (snapshot) => {
    const riderOrders = [];
    const orders = snapshot.val();
    for (let id in orders) {
      if (orders[id].rider.riderContactNum == riderNumber) {
        riderOrders.push(orders[id]);
      }
    }
    res.status(200).send(JSON.stringify(riderOrders));
  });
});

// @desc    Get all rider order by status
// @route   DELETE /api/getRiderOrders/:number/:status
app.get("/api/getRiderOrders/:number/:status", async (req, res) => {
  const riderNumber = req.params.number;
  const orderStatus = req.params.status;

  const snapshot = await db.ref(`orders`);
  snapshot.on("value", (snapshot) => {
    const riderOrders = [];
    const orders = snapshot.val();
    for (let id in orders) {
      if (
        orders[id].rider.riderContactNum == riderNumber &&
        orders[id].status == orderStatus
      ) {
        riderOrders.push(orders[id]);
      }
    }
    res.status(200).send(JSON.stringify(riderOrders));
  });
});

// @desc    Update order statys
// @route   POST /api/updateOrder
app.post("/api/updateOrder/:id", async (req, res) => {
  const test = req.body;
  await db.ref(`orders`).push(test);
  res.status(200).send(JSON.stringify(test));
});

exports.app = functions.https.onRequest(app);
