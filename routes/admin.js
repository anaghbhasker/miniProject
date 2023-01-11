const express=require('express')
const router=express.Router()
const adminController= require('../controllers/adminController')



router.post('/adminLogin',adminController.adminLogin)

router.get('/getUserDetails',adminController.getUserDetails)

router.post('/deleteUser',adminController.deleteUser)

module.exports=router