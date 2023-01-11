const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')

router.post('/register',userController.postSignup)

router.post('/login',userController.postLogin)

router.get('/userProfile',userController.userProfile)

router.post('/editProfilePhoto',userController.editUserprofile)

module.exports= router
