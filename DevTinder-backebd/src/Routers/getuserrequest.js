const express=require("express")
const {UserAuth}=require("../middlwares/auth.js")
const {ConnectionRequestModel}=require("../models/sendconnection.js")
const getuserrequest=express.Router()
const {UserModel}=require("../models/user")
getuserrequest.get("/connection/request/received", UserAuth, async (req, res) => {
  try {
    const LoggedInUser = req.User;
    console.log(`🔍 Fetching requests for user: ${LoggedInUser._id}`);
    
    const findAllRequest = await ConnectionRequestModel.find({
      ToUserid: LoggedInUser._id,
      Status: "interested"
    }).populate("FromUserId", ["FirstName", "LastName", "PhotoUrl", "Age", "Gender", "About", "Skills"]);

    console.log(`✅ Found ${findAllRequest.length} pending requests`);
    
    res.json({
      message: "All the requests you have received",
      connectionRequests: findAllRequest,
      count: findAllRequest.length
    });
  } catch (err) {
    console.error("❌ Error fetching requests:", err);
    res.status(400).json({ 
      error: err.message,
      message: "Failed to fetch connection requests" 
    });
  }
});


getuserrequest.get("/connection/accepted", UserAuth, async (req, res) => {
  try {
    const loggedPearson = req.User;

    const Getallconnections = await ConnectionRequestModel.find({
      $or: [
        { FromUserId: loggedPearson._id, Status: "accepted" },
        { ToUserid: loggedPearson._id, Status: "accepted" },
      ],
    })
      .populate("FromUserId", ["_id", "FirstName", "LastName", "PhotoUrl", "Age", "Gender", "About", "Skills"])
      .populate("ToUserid", ["_id", "FirstName", "LastName", "PhotoUrl", "Age", "Gender", "About", "Skills"]);

    // Use map to get only the friend (other user)
    const friends = Getallconnections.map(row => {
      if (row.FromUserId._id.toString() === loggedPearson._id.toString()) {
        return row.ToUserid; // friend is the receiver
      }
      return row.FromUserId; // friend is the sender
    });

    res.json({
      message: "find all your connections",
      friends
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// In getuserrequest.js or a new route
getuserrequest.get("/connection/stats", UserAuth, async (req, res) => {
  try {
    const user = req.User;

    const pendingRequests = await ConnectionRequestModel.countDocuments({
      ToUserid: user._id,
      Status: "interested",
    });

    const totalConnections = await ConnectionRequestModel.countDocuments({
      $or: [
        { FromUserId: user._id, Status: "accepted" },
        { ToUserid: user._id, Status: "accepted" },
      ],
    });

    res.json({
      pendingRequests,
      totalConnections,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

getuserrequest.get("/feed", UserAuth, async (req, res) => {
  try {
    const loggedUser = req.User;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 20) limit = 10;
    const skip = (page - 1) * limit;

    // ✅ Find all connection requests related to this user (except rejected/ignored)
    const existingConnections = await ConnectionRequestModel.find({
      $or: [
        { FromUserId: loggedUser._id, Status: { $in: ["interested", "accepted"] } },
        { ToUserid: loggedUser._id, Status: { $in: ["interested", "accepted"] } },
      ],
    }).select(["FromUserId", "ToUserid"]);

    // ✅ Collect all IDs to exclude (not already approached or already connected)
    const excludeIds = [loggedUser._id]; // Always exclude self
    existingConnections.forEach((conn) => {
      if (conn.FromUserId && !conn.FromUserId.equals(loggedUser._id)) {
        excludeIds.push(conn.FromUserId);
      }
      if (conn.ToUserid && !conn.ToUserid.equals(loggedUser._id)) {
        excludeIds.push(conn.ToUserid);
      }
    });

    // ✅ Fetch all users except excluded ones
    let query = {
      _id: { $nin: excludeIds },
    };

    // ✅ (optional) Only filter by profile completeness if user’s profile is complete
    const loggedUserData = await UserModel.findById(loggedUser._id);
    const hasCompleteProfile =
      loggedUserData.PhotoUrl &&
      loggedUserData.About &&
      loggedUserData.Skills &&
      loggedUserData.Skills.length > 0;

    if (hasCompleteProfile) {
      query.PhotoUrl = { $exists: true, $ne: "" };
      query.About = { $exists: true, $ne: "" };
    }

    const feedUsers = await UserModel.find(query)
      .select([
        "FirstName",
        "LastName",
        "Age",
        "Gender",
        "About",
        "Skills",
        "PhotoUrl",
      ])
      .skip(skip)
      .limit(limit);

    if (!feedUsers || feedUsers.length === 0) {
      return res.json({
        users: [],
        info: "No new users available right now.",
      });
    }

    return res.json({ users: feedUsers });
  } catch (err) {
    console.error("Feed Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});




module.exports={getuserrequest}