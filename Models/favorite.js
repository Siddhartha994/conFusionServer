const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const favoriteSchema = new Schema({
    dishDetails: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Dish',
        unique : true
    }],
    userinfo: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique : true
    }
});
var Favorites = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorites;