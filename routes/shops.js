const express = require('express');
const {getShops, getShop, updateShop} = require('../controllers/shops');
const {protect} = require('../middleware/auth')

// Include other resource routers
const appointmentRouter = require('./appointment');

const router = express.Router();

// Re-route into other resource routers
router.use('/:shopId/appointment/', appointmentRouter); 

router.route('/').get(getShops);
router.route('/:id').get(getShop).put(protect, updateShop);

module.exports=router;