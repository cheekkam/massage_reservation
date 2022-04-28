const mongoose = require('mongoose')

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    telephone_number: {
        type: String,
        required: [true, 'Please add a district'],
        maxlength: [10, 'Telephone number can not be more than 10 characters']
    },
    open_time: {
        type: String,
        required: [true, 'Please add an open time'],
        minlength: [5, 'HH:MM'],
        maxlength: [5, 'HH:MM']
    },
    close_time: {
        type: String,
        required: [true, 'Please add an close time'],
        minlength: [5, 'HH.MM'],
        maxlength: [5, 'HH.MM']
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// Cascadw delete appointments when a Shop is delete
ShopSchema.pre('remove', async function (next) {
    console.log(`Appointments being removed from shops ${this._id}`);
    await this.model('Appointment').deleteMany({Shop: this._id});
    next();
});

// Reverse populate with virtuals
ShopSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'shop',
    justOne: false
})

module.exports=mongoose.model('Shop', ShopSchema);