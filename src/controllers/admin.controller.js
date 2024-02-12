const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const AdminService = require('../services/admin.service')
const { generateAuthTokens } = require('../services/token.service');
const { Admin } = require('../models/admin');

const createFaceSyncUsers = catchAsync(async(req,res)=>{
    const data = await AdminService.createFaceSyncUsers(req);
    res.send(data)
})

const Login = catchAsync(async(req,res)=>{
    const data = await AdminService.Login(req);
    const token = await (generateAuthTokens(data))
    res.send({data,token})
})

const createEvents = catchAsync(async(req,res)=>{
    const data = await AdminService.createEvents(req);
    res.send(data)
})

const getEvents = catchAsync(async(req,res)=>{
    const data = await AdminService.getEvents(req);
    res.send(data)
})

const createPhotoGrapher = catchAsync(async(req,res)=>{
    const data = await AdminService.createPhotoGrapher(req);
    res.send(data)
})
 const getPhotographers = catchAsync(async (req,res)=>{
    const data = await AdminService.getPhotographers(req);
    res.send(data)
 })

module.exports = {
    createFaceSyncUsers,
    Login,
    createEvents,
    getEvents,
    createPhotoGrapher,
    getPhotographers,
}