import data from './data';
import mongo from 'mongodb';
import * as rx from 'rxjs';
import {first} from 'rxjs/operators';

// convenience types
type Query = {[key: string]: any};
type Projection = {projection: {[key: string]: number}};

// static parameters (define at project level?)
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'data';
const collectionName = 'puppies';

// instantiate the database connection as an Observable
const client = rx.bindNodeCallback(mongo.MongoClient.connect);
const connection = client(mongoUrl);

// convenience function
const errorHandler = function(error: any) {
    if (error) {
        console.error(error);
        return;
    }
}

// add initial data to database
connection
    .pipe(first())
    .subscribe(client => {
        const db = (client as mongo.MongoClient).db(dbName);
        const collection = db.collection(collectionName);
        collection.drop()
            .then(() => console.log(`collection ${collectionName} deleted`))
            .catch(errorHandler)
            .finally(() => {
                collection.insertMany(data as any)
                    .then((res) => console.log(`Number of rows inserted: ${res.insertedCount}`))
                    .catch(errorHandler);
            });
    }, errorHandler)

// convenience wrapper for running functions to db
function queryDB(fn: (collection: mongo.Collection<any>) => void): void {
    connection
        .pipe(first())
        .subscribe(client => {
            const db = (client as mongo.MongoClient).db(dbName);
            const collection = db.collection(collectionName);
            fn(collection)
        }, errorHandler)
}

// find all for query with projection
export function find(query: Query = {}, projection: Projection = {projection: {}}): rx.Subject<Array<any>> {
    const result = new rx.AsyncSubject<Array<any>>();

    let queryFn = function(collection: mongo.Collection<any>) {
        collection.find(query, projection).toArray((err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            result.next(res);
            result.complete();
        });
    };

    queryDB(queryFn);
    return result;
}

// find complete record for one
export function findOne(query: Query): rx.Subject<any> {
    const result = new rx.AsyncSubject<any>();

    let queryFn = function(collection: mongo.Collection<any>) {
        collection.findOne(query, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            result.next(res);
            result.complete();
        });
    };

    queryDB(queryFn);
    return result;
}


