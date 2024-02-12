const { Admin, Event, PhotoGrapher, EventAssign } = require('../models/admin');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const AWS = require('aws-sdk');
const qr = require('qrcode');

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
  let creations = await Admin.create({ ...req.body, ...{ password: pwd, userId: req.userId } });
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
  let foldername = await folderCreationDemo(req.body.eventName);
  let qrURL = await uploadQr(foldername);
  let creations = await Event.create({ ...req.body, ...{ userId: req.userId, foldername: foldername,qrURL:qrURL } });
  return creations;
};

const getEvents = async (req) => {
  let userId = req.userId;
  console.log(req.userId);
  let values = await Event.aggregate([
    {
      $match: { userId: userId, active:true },
    },
    {
      $lookup:{
        from:'eventassigns',
        localField:"_id",
        foreignField:"eventId",
        as:'assigned'
      }
    },
    {
      $unwind:{
        preserveNullAndEmptyArrays:true,
        path:"$assigned"
      }
    },
    {
      $project:{
        _id:1,
        eventName:1,
        eventLocation:1,
        eventDate:1,
        eventSummary:1,
        assigned:"$assigned"
      }
    }
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

const updatePhotographer = async (req) => {
  let id = req.params.id;
  let values = await Admin.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Photographer Not Found');
  }
  values = await Admin.findByIdAndUpdate({ _id: id }, req.body, { new: true });
  return values;
};

const getPhotographers = async (req) => {
  let userId = req.userId;
  let val = await Admin.aggregate([
    {
      $match: {
        role: 'photographer',
        userId: userId,
        active:true
      },
    },
    {

    }
  ]);
  return val;
};

const createAdminBySuperAdmin = async (req) => {
  let pwd = generateSixDigitPasswordWithLetters();
  let creations = await Admin.create({ ...req.body, ...{ password: pwd } });
  return creations;
};

const updateEventsById = async (req) => {
  let id = req.params.id;
  let findEvent = await Event.findById(id);
  if (!findEvent) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Event Not Found');
  }
  findEvent = await Event.findByIdAndUpdate({ _id: id }, req.body, { new: true });
  return findEvent;
};

const EventAssign_to_PhotoGrapher = async (req) => {
  let userId = req.userId;
  let values = await EventAssign.create({ ...req.body, ...{ userId: userId } });
  return values;
};

const getEventsByPhotoGrapher = async (req) => {
  let userId = req.userId;
  let values = await EventAssign.aggregate([
    {
      $match: {
        photographerId: userId,
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: 'eventId',
        foreignField: '_id',
        as: 'events',
      },
    },
    {
      $unwind: { preserveNullAndEmptyArrays: true, path: '$events' },
    },
    {
      $lookup: {
        from: 'admins',
        localField: 'photographerId',
        foreignField: '_id',
        as: 'photographer',
      },
    },
    {
      $unwind: { preserveNullAndEmptyArrays: true, path: '$photographer' },
    },
    {
      $project: {
        _id: 1,
        eventId: 1,
        eventName: '$events.eventName',
        eventLocation: '$events.eventLocation',
        eventDate: '$events.eventDate',
        eventSummary: '$events.eventSummary',
      },
    },
  ]);
  return values;
};

const getAdmins = async (req) => {
  console.log(req.userId);
  let values = await Admin.aggregate([
    {
      $match: {
        userId: req.userId,
        role: 'admin',
        active:true
      },
    },
  ]);
  return values;
};

const folderCreationDemo = async (folderName) => {
  // Aws
  const spacesEndpoint = new AWS.Endpoint('https://blr1.digitaloceanspaces.com');
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    // useAccelerateEndpoint: false,
    // s3ForcePathStyle: false,
    // region: 'us-east-1',
    credentials: new AWS.Credentials('DO00EJFRZZE7JJX4HYJW', 'sORWVDUfafFT0LP9O52AM56mMLsnXARg0AH60qQRF8k'),
  });
  let pwd = generateSixDigitPasswordWithLetters();
  async function createFolder(folderPath) {
    try {
      await s3
        .putObject({
          Bucket: 'facesync',
          Key: folderPath,
          Body: '',
        })
        .promise();
    } catch (error) {
      console.error(`Error creating folder ${folderPath}:`, error);
    }
  }
  async function createFolders() {
    await createFolder(`${folderName}-${pwd}/`);
    await createFolder(`${folderName}-${pwd}/user/`);
    await createFolder(`${folderName}-${pwd}/photographer/`);
  }
  createFolders();
  return `${folderName}-${pwd}`;
};

const uploadQr = async (folderName) => {
  const spacesEndpoint = new AWS.Endpoint('https://blr1.digitaloceanspaces.com');
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    // useAccelerateEndpoint: false,
    // s3ForcePathStyle: false,
    // region: 'us-east-1',
    credentials: new AWS.Credentials('DO00EJFRZZE7JJX4HYJW', 'sORWVDUfafFT0LP9O52AM56mMLsnXARg0AH60qQRF8k'),
  });
  const url = 'https://facesync.whydev.co.in?event=' + folderName;
  const qrCode = await qr.toDataURL(url);
  const data = qrCode.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(data, 'base64');
  const params = {
    Bucket: 'facesync',
    Key: `${folderName}.png`,
    Body: buffer,
    ACL: 'public-read',
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        console.log(data);
        resolve(data.Location);
      }
    });
  });
};

module.exports = {
  createFaceSyncUsers,
  Login,
  createEvents,
  getEvents,
  createPhotoGrapher,
  getPhotographers,
  createAdminBySuperAdmin,
  updateEventsById,
  updatePhotographer,
  EventAssign_to_PhotoGrapher,
  getEventsByPhotoGrapher,
  getAdmins,
};
