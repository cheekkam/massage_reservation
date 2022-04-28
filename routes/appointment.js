const express = require('express');
const {getAppointments, getAppointment, addAppointment, updateAppointment, deleteAppointment} = require('../controllers/appointment');
const router = express.Router({mergeParams: true});
const {protect} = require('../middleware/auth');

router.route('/')
    .get(protect, getAppointments)
    .post(protect, addAppointment);

router.route('/:id')
    .get(protect, getAppointment)
    .put(protect, updateAppointment)
    .delete(protect, deleteAppointment);

module.exports = router;