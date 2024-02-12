const express = require('express');
const router = express.Router();
const AdminController = require('../../controllers/admin.controller');
const Auth = require('../../middlewares/AdminAuth')
router.route('/').post(Auth,AdminController.createFaceSyncUsers);
router.route('/login').post(AdminController.Login)
router.route('/events').post(Auth,AdminController.createEvents)
router.route('/get/events').get(Auth,AdminController.getEvents)
router.route('/photogpaher').post(Auth,AdminController.createPhotoGrapher);
router.route('/get/photogpaher').get(Auth,AdminController.getPhotographers);

module.exports = router