'use strict';
const expect                = require('chai').expect;
const fs                    = require('fs');
const assignment            = require('./index.js');

describe('promises', function() {
    const store = {};

    // create a random file system before tests
    before(() => {
        fs.mkdirSync('./files');
        const length = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < length; i++) {
            const name = 'file' + i + '.txt';
            const content = Math.random();
            store[name] = '' + content;
            fs.writeFileSync('./files/' + name, content, 'utf8');
        }
    });
    
    describe('resolvedPath', () => {

        it('is exported', () => {
            expect(assignment).to.haveOwnProperty('resolvedPath');
        });

        it('is a function', () => {
            expect(assignment.resolvedPath).to.be.a('function');
        });

        it('takes two parameters', () => {
            expect(assignment.resolvedPath.length).to.equal(2);
        });

        it('resolves two string paths', () => {
            const paths = ['foo', 'bar', 'baz', 'abc', 'def', 'ghi'];
            const dirPath = paths[Math.floor(Math.random() * paths.length)];
            const filePath = paths[Math.floor(Math.random() * paths.length)];
            const path = assignment.resolvedPath('/' + dirPath, filePath);
            expect(path).to.equal('/' + dirPath + '/' + filePath);
        });

    });

    describe('readFile', () => {
        it('is exported', () => {
            expect(assignment).to.haveOwnProperty('resolvedPath');
        });

        it('is a function', () => {
            expect(assignment.readFile).to.be.a('function');
        });

        it('takes one parameter', () => {
            expect(assignment.readFile.length).to.equal(1);
        });

        it('returns a promise', () => {
            const promise = assignment.readFile('./fake/path');
            expect(isAPromise(promise)).to.be.true;
            promise.catch(e => {});
        });

        it('can read a file', () => {
           const name = Object.keys(store)[0];
           return assignment.readFile('./files/' + name)
               .then(content => {
                   expect(content).to.equal(store[name]);
               });
        });

        it('rejects with read error from fs.readFile', () => {
            return assignment.readFile('./fake-file')
                .then(
                    content => expect.fail('a rejected promise', 'a resolved promise'),
                    err => expect(err.code).to.equal('ENOENT')
                );
        });

    });

    describe('readDir', () => {
        it('is exported', () => {
            expect(assignment).to.haveOwnProperty('readDir');
        });

        it('is a function', () => {
            expect(assignment.readDir).to.be.a('function');
        });

        it('takes one parameter', () => {
            expect(assignment.readDir.length).to.equal(1);
        });

        it('returns a promise', () => {
            const promise = assignment.readDir('./fake/path');
            expect(isAPromise(promise)).to.be.true;
            promise.catch(e => {});
        });

        it('gets the correct files', () => {
            return assignment.readDir('./files')
                .then(files => {
                    expect(files).to.deep.equal(Object.keys(store));
                });
        });

    });

    describe('readDirFiles', () => {
        it('is exported', () => {
            expect(assignment).to.haveOwnProperty('readDirFiles');
        });

        it('is a function', () => {
            expect(assignment.readDirFiles).to.be.a('function');
        });

        it('takes one parameter', () => {
            expect(assignment.readDirFiles.length).to.equal(1);
        });

        it('returns a promise', () => {
            const promise = assignment.readDirFiles('./fake/path');
            expect(isAPromise(promise)).to.be.true;
            promise.catch(e => {});
        });

        it('gets the correct content for files', () => {
            const contents = Object.keys(store)
                .map(name => store[name]);
            return assignment.readDirFiles('./files')
                .then(results => {
                    expect(results).to.deep.equal(contents);
                });
        });

    });
    
});

function isAPromise(o) {
    return o &&
        typeof o === 'object' &&
        typeof o.then === 'function' &&
        typeof o.catch === 'function';
}