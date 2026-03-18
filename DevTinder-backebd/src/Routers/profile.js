const express=require("express")
const ProfileRouter=express.Router()
const {UserAuth}=require("../middlwares/auth.js")
const {ValidateProfileEditData}=require("../utils/validation.js")
const upload = require("../middlwares/upload.js");

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

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    loggedInUser.PhotoUrl = `${baseUrl}/uploads/${req.file.filename}`;


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