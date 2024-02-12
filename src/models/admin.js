const mongoose = require('mongoose');
const { v4 } = require('uuid');

const AdminSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userName: {
      type: String,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'photographer'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
    },
    userId: String,
    address:String,
    companyName:String,
  },
  { timestamps: true }
);

const Admin = mongoose.model('admin', AdminSchema);

const EventSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    eventName: String,
    eventLocation: String,
    eventDate: String,
    eventSummary: String,
    userId: String,
    foldername:String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model('events', EventSchema);

const PhotographerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    photographerName: String,
    photographerContact: String,
    photographeremail: String,
    userId: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const PhotoGrapher = mongoose.model('photographer', PhotographerSchema);

const EventAssignSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    eventId:String,
    photographerId:String,
    userId:String
  },
  { timestamps: true }
);

const EventAssign = mongoose.model('eventassign', EventAssignSchema);

module.exports = {
  Admin,
  Event,
  PhotoGrapher,
  EventAssign,
};
