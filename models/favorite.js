const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user'
    },
    campsites: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Campsite'
    }
})

const Favorites = mongoose.model('favorites', favoriteSchema)

module.exports = Favorites;