const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '64f4adeab98d6b4b527d3943',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{
                url: 'https://res.cloudinary.com/drq8bsinw/image/upload/v1694053082/Yelpcamp-image/tpo7w7duahn13fkb2xic.jpg',
                filename: 'Yelpcamp-image/leqwl1tvv3hzy6bgavih'
            }, {
                url: 'https://res.cloudinary.com/drq8bsinw/image/upload/v1694053082/Yelpcamp-image/tpo7w7duahn13fkb2xic.jpg',
                filename: 'Yelpcamp-image/leqwl1tvv3hzy6bgavih'
            },],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})