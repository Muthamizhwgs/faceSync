const express = require('express');
const router = express.Router();
const AdminController = require('../../controllers/admin.controller');

router.route('/').post(AdminController.createFaceSyncUsers);
router.route('/login').post(AdminController.Login)


module.exports = router