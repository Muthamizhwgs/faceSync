const { Admin, Event, PhotoGrapher } = require('../models/admin');
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

const createFaceSyncUsers = async (req) => {
  let pwd = generateSixDigitPasswordWithLetters();
  let creations = await Admin.create({ ...req.body, ...{ password: pwd, userId:req.userId } });
  return creations;
};

const Login = async (req) => {
  let findByUserName = await Admin.findOne({ userName: req.body.userName, password: req.body.password });
  if (!findByUserName) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
  }
  return findByUserName;
};

const createEvents = async (req) => {
  let creations = await Event.create({ ...req.body, ...{ userId: req.userId } });
  return creations;
};

const getEvents = async (req) => {
  let userId = req.userId;
  console.log(req.userId);
  let values = await Event.aggregate([
    {
      $match: { userId: userId },
    },
  ]);
  return values;
};

const createPhotoGrapher = async (req) => {
  let findByCOntact = await PhotoGrapher.findOne({ photographerContact: req.body.photographerContact });
  if (findByCOntact) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number Already Exist');
  }
  let findByEmial = await PhotoGrapher.findOne({ photographeremail: req.body.photographeremail });
  if (findByEmial) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email Already Exist');
  }
  const creation = await PhotoGrapher.create({ ...req.body, ...{ userId: req.userId } });
  return creation;
};

const getPhotographers = async (req) => {
  let userId = req.userId;
  let val = await Admin.aggregate([
    {
      $match: {
        role: 'photographer',
        userId:userId
      },
    },
  ]);
  return val
};

module.exports = {
  createFaceSyncUsers,
  Login,
  createEvents,
  getEvents,
  createPhotoGrapher,
  getPhotographers
};
