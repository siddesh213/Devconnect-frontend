const express=require("express")
const ProfileRouter=express.Router()
const {UserAuth}=require("../middlwares/auth.js")
const {ValidateProfileEditData}=require("../utils/validation.js")
const upload = require("../middlwares/upload.js");
const { UserModel } = require("../models/user.js");

// NOTE: Remove sensitive fields before sending user back to the client
const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.PassWord;
  return user;
};

ProfileRouter.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const UserData = req.User;
    res.json(sanitizeUser(UserData));
  } catch (err) {
    console.log(err.message);
    res.status(403).send("Invalid or expired token");
  }
});

// ✅ GET another user's profile by ID
ProfileRouter.get("/user/:userId", UserAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ 
      message: "User profile fetched successfully",
      data: sanitizeUser(user) 
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

ProfileRouter.patch("/profile/edit",UserAuth,async(req,res)=>{
    try{
    const ValidateEProfileEdit=ValidateProfileEditData(req)
    if (!ValidateEProfileEdit){
        throw new Error("Inavalid Edit requets")
    }
    const LoggedInUser=  req.User
    console.log(LoggedInUser)
    Object.keys(req.body).forEach((key)=>(LoggedInUser[key]=req.body[key]))
     await LoggedInUser.save()
     res.json({
       message: `${LoggedInUser.FirstName} your profile updated succesfully`,
       data: sanitizeUser(LoggedInUser),
     }) 

    

    
    }catch(err){
        res.status(400).send(err.message)

    }

})
ProfileRouter.post("/profile/upload", UserAuth, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const loggedInUser = req.User;

    // ✅ Cloudinary stores the URL in path property
    loggedInUser.PhotoUrl = req.file.path;

    await loggedInUser.save();

    res.json({
      message: "Photo uploaded successfully ✅",
      data: sanitizeUser(loggedInUser),
    });
  } catch (err) {
    res.status(500).send("Upload failed: " + err.message);
  }
});

module.exports = { ProfileRouter };

// module.exports={ProfileRouter}