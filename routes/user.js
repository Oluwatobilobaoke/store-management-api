const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
    getAttendantByFirstName,
    getAllAttendant,
    getAttendantById,
    deactivateAttendant,
    makeAttendantAdmin,
} = require('../controllers/user');



const router = express.Router();

router.route('/').get(protect, getAttendantByFirstName);

router.route('/attendants').get(protect, authorize('admin'), getAllAttendant);


router
    .route('/attendants/:attendantId')
    .get(protect, authorize('admin'), getAttendantById)
    .put(protect, authorize('admin'), deactivateAttendant);

router
    .route('/attendants/:attendantId/become-an-admin')
    .put(protect, authorize('admin'), makeAttendantAdmin);
module.exports = router;
