const Appointment = require('../models/Appointment');
const Shop = require('../models/Shop');

//@desc     Get all appointments
//@route    Get /api/v1/appointment
//@access   Public
exports.getAppointments = async (req,res,next) => {
    let query;
    // General users can see only their appointment
    query = Appointment.find({user:req.user.id}).populate({
        path: 'shop',
        select: 'name address telephone_number open_time close_time'
    });

    try {
        const appoinments = await query;
        res.status(200).json({
            success: true,
            count: appoinments.length,
            data: appoinments
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false, 
            message: "Cannot find Appoinment"});
    }
};

//@desc     Get single appointment
//@route    Get /api/v1/appointment/:id
//@access   Public
exports.getAppointment = async (req,res,next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'shop',
            select: 'name address telephone_number open_time close_time'
        });

        if (!appointment) {
            return res.status(404).json({
                success: false, 
                message: `No appointment with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false, 
            message: "Cannot find Appointment"})
    }
};

//@desc     Add appointment
//@route    POST /api/v1/shops/:shopId/appointment
//@access   Private
exports.addAppointment = async (req,res,next) => {
    try {
        req.body.shop = req.params.shopId;
        const shop = await Shop.findById(req.params.shopId);

        if (!shop) {
            return res.status(404).json({success: false, message: `No shop with the id of ${req.params.shopId}`});
        }
        
        // Add user Id to req.body
        req.body.user = req.user.id;

        // Check for existed appointment
        const existedAppointments = await Appointment.find({user: req.user.id});

        // The user can only create 3 appointments
        if (existedAppointments.length >= 3) {
            return res.status(400).json({success: false, message: `The user with ID ${req.user.id} has already made 3 appointments`});
        }

        const appointment = await Appointment.create(req.body);

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Cannot create Appointment"})
    }
};

//@desc     Update appointments
//@route    PUT /api/v1/appointment/:id
//@access   Private
exports.updateAppointment = async (req,res,next) => {
    try {
        let appoinment = await Appointment.findById(req.params.id);

        if (!appoinment) {
            return res.status(404).json({success: false, message: `No appoinment with the id of ${req.params.id}`});
        }

        // Make sure user is the appointment owner
        if (appoinment.user.toString() !== req.user.id) {
            return res.status(401).json({success: false, message: `User ${req.user.id} is not authorize to update this appointment`});
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Cannot update Appointment"})
    }
};

//@desc     Delete appointments
//@route    DELETE /api/v1/Shops/:id
//@access   Private
exports.deleteAppointment = async (req,res,next) => {
    try {
        const appoinment = await Appointment.findById(req.params.id);

        if (!appoinment) {
            return res.status(404).json({
                success: false, 
                message: `No appoinment with the id of ${req.params.id}`});
        }
        
        // Make sure user is the appointment owner
        if (appoinment.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false, 
                message: `User ${req.params.id} is not authorize to delete this bootcamp`});
        }
        
        await appoinment.remove()

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Cannot delete Appointment"})
    }
};