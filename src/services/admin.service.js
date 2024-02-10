const { Admin } = require('../models/admin')
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');


function generateSixDigitPasswordWithLetters() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let password = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

const createFaceSyncUsers = async (req)=>{
    let pwd = generateSixDigitPasswordWithLetters();
    let creations = await Admin.create({...req.body,...{password:pwd}});
    return creations;
}

const Login = async (req)=>{
    let findByUserName = await Admin.findOne({userName:req.body.userName, password:req.body.password})
    if(!findByUserName){
        throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found")
    }
    return findByUserName
}

module.exports = {
    createFaceSyncUsers,
    Login
}