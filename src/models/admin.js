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
  },
  { timestamps: true }
);

const Admin = mongoose.model('admin', AdminSchema)


module.exports = {
    Admin
}
