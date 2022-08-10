require('dotenv').config();
const { query } = require('express');
const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// home route
app.get("/", (req, res) => {
    res.render("index" , { title : "Home"});
});

// artist-search route
app.get("/artist-search", (req, res) => {
    const { artistname } = req.query;
    spotifyApi
        .searchArtists(artistname)
        .then( (data) => {
            const artists = data.body.artists.items;
            res.render('artist-search-results', { title : "Artists", artists })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

// albums route
app.get("/albums/:artistid", (req, res, next) => {
    const { artistid } = req.params;
    spotifyApi
        .getArtistAlbums(artistid)
        .then( (data) => {
            const albums = data.body.items;
            res.render('albums', {title: "Albums", albums})
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
})

// tracks route
app.get("/tracks/:albumid", (req, res, next) => {
    const { albumid } = req.params;
    spotifyApi
        .getAlbumTracks(albumid)
        .then( (data) => {
            const tracks = data.body.items;
            res.render('tracks', {title: "Tracks", tracks})
        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
