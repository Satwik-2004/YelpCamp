const mongoose= require('mongoose');
const Campground=require('../models/camground');
const cities= require('./cities');
const {places,descriptors}= require('./seedHelpers');


mongoose.connect('mongodb://127.0.0.1:27017/yelp_camp');
const db= mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random()* array.length)];

const seedDB= async () => {
    await Campground.deleteMany();
    for(let i=0; i<300; i++){
        const random1000= Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()* 20) + 10;
        const camp= new Campground({
            author: '677f97f88c9949f1371435fd',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:`Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis ipsa est ipsam ut corrupti, deleniti fuga doloribus sit officia ex iure non! Eaque officia voluptates nesciunt, saepe odio laborum facere.`,
            price,
            geometry:{
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude 
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dhzyemopo/image/upload/v1736704528/YelpCamp/wizsi6hkldtmd3biajie.jpg',
                  filename: 'YelpCamp/wizsi6hkldtmd3biajie'
                  
                },
                {
                  url: 'https://res.cloudinary.com/dhzyemopo/image/upload/v1736704528/YelpCamp/hsl20nrvy4unekx22vzm.jpg',
                  filename: 'YelpCamp/hsl20nrvy4unekx22vzm'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})