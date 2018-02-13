#!/usr/bin/env node

'use strict';

const http = require('http');
const path = require('path');
const process = require('process');
const child = require('child_process');

let couchurl = process.env.COUCHDB_URL ? process.env.COUCHDB_URL : 'http://localhost:5984';
let couchdb_alive = false;

let nTries = 0;

if (typeof couchurl === undefined || couchurl === null) {
  couchurl = 'http://localhost:5984';
}

const testCouchServer = function(url) {
  return new Promise((resolve, reject) => {
    let request = http.get(url, (response) => {
      let dataChunk = '';
      if (response.statusCode !== 200) {
        reject(new Error('Access to chouchDB failed.'));
      }

      response.on('data', (data) => { dataChunk += data; });
      response.on('end', () => {
        resolve(JSON.parse(dataChunk));
        console.log('On end of request');
      });
    });
    request.on('error', (err) => reject(err));
  });
};

testCouchServer(couchurl)
  .then(
    () => {
      console.log('Starting ember server');
      child.exec('ember serve', (error, stdout, stderr) => {
        if (error) {
          console.error('Execution error: ${error}');
          return;
        }
      });
    }
  )
  .catch((err) => {
    console.error('Oops! Looks like CouchDB isn\'t running. CouchDB must be running before you can start HospitalRun.');
    console.error('For help or more info see https://github.com/HospitalRun/hospitalrun-frontend#install');
  });

console.log('Finalizando...');