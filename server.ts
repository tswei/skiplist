import express from 'express';
import mongo from 'mongodb';
import * as database from './database';

// create server and define constants
const app = express();
const port = process.env.PORT || 8000;
// process.title = "expressServer";

app.get(`/api/photos/:photoId/`, (req, res) => {
    database
        .findOne({_id: new mongo.ObjectID(req.params.photoId)})
        .subscribe((result: any) => res.send({express: result}));
})

app.get(`/api/photos/`, (_req, res) => {
    database
        .find({}, {projection: {_id: 1, title: 1}})
        .subscribe((result: Array<any>) => res.send({express: result}));
});

app.get(`/api/test`, (_req, res) => {
    res.send({express: "EXPRESS SERVER IS RUNNING"});
});

app.listen(port, () => console.log(`Express server listening on port ${port}`));
