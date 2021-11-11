const express = require('express');
const albums = require('./albumsData.json');
const albumsFile = './albumsData.json';
const fs = require('fs');
const addToJson = (albums) =>
	fs.writeFileSync(albumsFile, JSON.stringify(albums, null, 4));
const getFromJson = () => JSON.parse(fs.readFileSync(albumsFile));
const port = 3000;
const app = express();
app.use(express.json());
const findAlbumById = (req, res) => {
	const id = req.params.id;
	const foundAlbum = albums.find((album) => album.albumId === id);
	if (foundAlbum) {
		res.send(foundAlbum);
	} else res.status(404).send('The album is not found');
};
const postNewAlbum = (req, res) => {
	const newAlbumObj = req.body;
	const allAlbums = getFromJson();
	const isObjectUnique = allAlbums.find(
		(album) => album.albumId === newAlbumObj.albumId
	);
	if (!isObjectUnique) {
		allAlbums.push(newAlbumObj);
		addToJson(allAlbums);

		res.status(201).send({ success: true });
	} else
		res.status(400).send('Error. This album is already in the list!');
};
const deletedAlbumById = (req, res) => {
	const id = req.params.id;
	let allAlbums = getFromJson();
	const foundAlbum = albums.find((album) => album.albumId === id);
	if (foundAlbum) {
		allAlbums = allAlbums.filter(
			(album) => album.albumId !== foundAlbum.albumId
		);
		addToJson(allAlbums);
		res.send(foundAlbum);
	} else
		res.status(400).send('Error. There is no such  album in our collection!');
};
app.get('/albums', (req, res) => {
	res.send(albums);
});
app.get('/albums/:id', findAlbumById);
app.post('/albums', postNewAlbum);
app.delete('/albums/:id', deletedAlbumById);

app.listen(port, () => {
	console.log(`The server is up and running on port: ${port}`);
});
