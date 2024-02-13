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
    eventId: String,
    photographerId: String,
    userId: String,
  },
  { timestamps: true }
);

const EventAssign = mongoose.model('eventassign', EventAssignSchema);

const TempImagSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  images: {
    type: Array,
    default: [],
  },
  imagesNmas: {
    type: Array,
    default: [],
  },
});

const TempImg = mongoose.model('tempimages', TempImagSchema);

module.exports = {
  Admin,
  Event,
  PhotoGrapher,
  TempImg,
  EventAssign,
};
