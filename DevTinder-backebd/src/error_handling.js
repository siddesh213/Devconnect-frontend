const express=require("express")
const app=express()
app.get("/patient",(req,res,next)=>{
    const id =2
    try{if(!id){
       const err=new Error()
       throw err
    }
    res.send("patient id found")

}catch(err){
    next(err)
}
})
app.use((err,req,res,next)=>{
    res.send("patient id is not found")
})




app.listen(3000,()=>{
    console.log("server is running on port 3000")

});
