const mongoose= require('mongoose');

const Review= require('./review');
const { required } = require('joi');
const Schema= mongoose.Schema;
// https://res.cloudinary.com/dhzyemopo/image/upload/v1736786976/YelpCamp/smilpzulofjfujly6e3v.png
const ImageSchema= new Schema({
        url: String,
        filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url ? this.url.replace('/upload', '/upload/w_200') : '';
});
const opts= { toJSON: { virtuals: true }};

const campgroundSchema= new Schema({
    title: String,
    geometry: {
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User', 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Review'
        }
    ]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}"> ${this.title} </a><strong>
    <p>${this.description.substring(0, 20)}...</p> 
    `
});
campgroundSchema.virtual('thumbnail').get(function() {
    if (this.images && this.images.length > 0) {
        return this.images[0].url.replace('/upload', '/upload/w_200');
    }
    return '/images/default-campground.jpg';
});


campgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews 
            }
        })
    }
})

module.exports= mongoose.model('Campground', campgroundSchema);