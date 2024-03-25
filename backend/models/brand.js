const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    // icon: {
    //     type: String,
    // },
    // color: { 
    //     type: String,
    // },
})


brandSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

brandSchema.set('toJSON', {
    virtuals: true,
});
// categorySchema.method('toJSON', function(){
//     const { __v, ...object } = this.toObject();
//     const { _id:id, ...result } = object;
//     return { ...result, id };
// });

exports.Brand = mongoose.model('Brand', brandSchema);
// {
//     "name": "Electronics",
//     "icon": "category.jpg",
//     "color": "white"
// }