const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const AdminService = require('../services/admin.service')
const { generateAuthTokens } = require('../services/token.service')
const createFaceSyncUsers = catchAsync(async(req,res)=>{
    const data = await AdminService.createFaceSyncUsers(req);
    res.send(data)
})

const Login = catchAsync(async(req,res)=>{
    const data = await AdminService.Login(req);
    const token = await (generateAuthTokens(data))
    res.send({data,token})
})

module.exports = {
    createFaceSyncUsers,
    Login
}