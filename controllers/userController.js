const userCollection= require('../models/user_Schema')
const bcrypt = require('bcrypt');
const { generateAuthToken, verifyToken } = require('../middlewares/jwt');


module.exports.postSignup=async(req ,res)=>{
    try {
        let userDetails=req.body
        const user=await userCollection.find({ email:userDetails.email})
        if (user.length===0) {
            userDetails.password= await bcrypt.hash(userDetails.password, 10)
            userCollection.create({
                name:userDetails.name,
                email:userDetails.email,
                phone:userDetails.phone,
                password:userDetails.password
            })
            const token =generateAuthToken(userDetails)
            return res.json({token})
        }else{
            return res.json({error:true})
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.postLogin=async(req,res)=>{
    let  userSignUpp={
        Status:false,
        message:null,
        token:null,
        name:null
        }
    try {
        const userDetails= req.body
        const findUser= await userCollection.findOne({ email : userDetails.email})
        if (findUser) {
            const isMatch = await bcrypt.compare(userDetails.password,findUser.password)
            if (isMatch===true) {
                const token =generateAuthToken(findUser)
                const name=findUser.name
                userSignUpp.message = "You are logged"
                userSignUpp.Status = true
                userSignUpp.token = token
                userSignUpp.name=findUser.name

                let obj = {
                    token,name
                }

                res.cookie("jwt",obj,{
                    httpOnly: false,
                    maxAge: 6000 * 1000,
                }).status(200).send({userSignUpp})

            } else {
                userSignUpp.message = " Password is wrong"
                userSignUpp.Status = false
                res.send({ userSignUpp })
            }
        } else {
            userSignUpp.message = "your Email wrong"
            userSignUpp.Status = false
            res.send({ userSignUpp })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.userProfile=async(req,res)=>{
    try {
        const token= req.query.token
        const userId=verifyToken(token)
        let userDetails=await userCollection.findOne({_id:userId})
        if (userDetails) {
            res.status(200).send({ userDetails }) 
        } else {
            res.status(500).send({ erroe: "no user" })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.editUserprofile=async(req,res)=>{
    try {
        const userNewDetails=req.body
        const token= req.body.token
        const userId=verifyToken(token)
        await userCollection.findByIdAndUpdate(userId,{
            name:userNewDetails.name,
            email:userNewDetails.email,
            phone:userNewDetails.phone,
            image:userNewDetails.image
        })
        res.json({status:'success'})
    } catch (error) {
        res.json({status:'failed'})
    }
}