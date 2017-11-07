const path = require('path');
const fs = require('fs');

exports.resolvedPath = function(dirPath, fileName) {
    return path.resolve(dirPath, fileName);
};

exports.readFile = function(filePath) {
    return new Promise(function(resolve, reject){
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err){
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });  
};

exports.readDir = function(dirPath){
    return new Promise(function(resolve, reject){
        fs.readdir(dirPath, (err, files) => {
            if(err){
                reject(err);
            }
            else {
                resolve(files);
            }
        })
    });
};

exports.readDirFiles = function(dirPath) {
    return exports.readDir(dirPath)
        .then(function(fileNames){
            var arr = [];
            for(let i = 0; i < fileNames.length; i++){
                arr.push(exports.readFile(
                    exports.resolvedPath(
                        dirPath, fileNames[i])));
            }
            return Promise.all(arr); //returns a promise
        });
    };