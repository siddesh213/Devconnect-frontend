const express = require("express");
const RequestRouter = express.Router();
const { UserAuth } = require("../middlwares/auth.js");
const { ConnectionRequestModel } = require("../models/sendconnection.js");
const { UserModel } = require("../models/user.js");


// ✅ SEND CONNECTION REQUEST
RequestRouter.post("/sendconnection/:status/:touserid", UserAuth, async (req, res) => {
  try {
    const AllowedStatus = ["ignored", "interested"];
    const FromUserId = req.User._id;
    const ToUserid = req.params.touserid;
    const Status = req.params.status;

    if (!AllowedStatus.includes(Status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (FromUserId.toString() === ToUserid.toString()) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    const toUser = await UserModel.findById(ToUserid);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = await ConnectionRequestModel.findOne({
      $or: [
        { FromUserId: FromUserId, ToUserid: ToUserid },
        { FromUserId: ToUserid, ToUserid: FromUserId },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: "Connection request already exists" });
    }

    const newRequest = new ConnectionRequestModel({ FromUserId, ToUserid, Status });
    const saved = await newRequest.save();

    res.json({
      message: `${req.User.FirstName} marked '${Status}' for connection with ${toUser.FirstName}`,
      saved,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ REVIEW CONNECTION REQUEST (ACCEPT / REJECT)
RequestRouter.post("/reviewrequest/:status/:senderid", UserAuth, async (req, res) => {
  try {
    const LoggedUser = req.User;
    const AllowedStatuses = ["accepted", "rejected"];
    const ReviewStatus = req.params.status;
    const SenderId = req.params.senderid;

    if (!AllowedStatuses.includes(ReviewStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // ✅ Convert SenderId string to ObjectId for proper comparison
    const mongoose = require("mongoose");
    const senderObjectId = new mongoose.Types.ObjectId(SenderId);
    const loggedInObjectId = LoggedUser._id;

    console.log(`🔍 Looking for request from ${senderObjectId} to ${loggedInObjectId}`);

    // find pending interested request
    const existing = await ConnectionRequestModel.findOne({
      FromUserId: senderObjectId,
      ToUserid: loggedInObjectId,
      Status: "interested",
    });

    if (!existing) {
      console.log("❌ Request not found. Checking database state...");
      
      // Debug: Check if there are any requests between these users
      const allRequests = await ConnectionRequestModel.find({
        $or: [
          { FromUserId: senderObjectId, ToUserid: loggedInObjectId },
          { FromUserId: loggedInObjectId, ToUserid: senderObjectId },
        ],
      });
      
      console.log("Existing requests:", allRequests);
      return res.status(404).json({ 
        message: "Connection request not found",
        debug: allRequests 
      });
    }

    existing.Status = ReviewStatus;
    const updated = await existing.save();

    const sender = await UserModel.findById(SenderId).select("FirstName");
    const receiverName = LoggedUser.FirstName;

    let notification =
      ReviewStatus === "accepted"
        ? `🎉 ${receiverName} accepted your connection request!`
        : `❌ ${receiverName} rejected your connection request.`;

    console.log("✅ " + notification);

    // optional auto message
    if (ReviewStatus === "accepted") {
      console.log(`💬 Auto message sent to ${sender.FirstName}: "Let's connect and collaborate!"`);
    }

    res.json({
      message: "Connection status updated successfully ✅",
      updated,
      notification,
    });
  } catch (err) {
    console.error("Review request error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = { RequestRouter };
