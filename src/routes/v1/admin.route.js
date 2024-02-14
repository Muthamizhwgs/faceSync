const express = require('express');

const router = express.Router();
const AdminController = require('../../controllers/admin.controller');
const Auth = require('../../middlewares/AdminAuth');

router.route('/').post(Auth,AdminController.createFaceSyncUsers);
router.route('/login').post(AdminController.Login)
router.route('/events').post(Auth,AdminController.createEvents)
router.route('/get/events').get(Auth,AdminController.getEvents)
router.route('/photogpaher').post(Auth,AdminController.createPhotoGrapher);
router.route('/get/photogpaher').get(Auth,AdminController.getPhotographers);
router.route('/create/adminby/SuperAdmin').post(AdminController.createAdminBySuperAdmin);
router.route('/updateEvents/:id').put(Auth,AdminController.updateEventsById);
router.route('/update/Photographer/:id').put(Auth,AdminController.updatePhotographer);
router.route('/event/assign').post(Auth,AdminController.EventAssign_to_PhotoGrapher);
router.route('/getEventsBy/PhotoGrapher').get(Auth,AdminController.getEventsByPhotoGrapher)
router.route('/get/admins').get(Auth, AdminController.getAdmins);

router.route('/').post(Auth, AdminController.createFaceSyncUsers);
router.route('/login').post(AdminController.Login);
router.route('/events').post(Auth, AdminController.createEvents);
router.route('/get/events').get(Auth, AdminController.getEvents);
router.route('/photogpaher').post(Auth, AdminController.createPhotoGrapher);
router.route('/get/photogpaher').get(Auth, AdminController.getPhotographers);
router.route('/groups').post(GroupImg.array('images'), AdminController.uploadGroupImages)

module.exports = router;
