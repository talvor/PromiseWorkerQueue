var BlueBirdQueue = require('bluebird-queue'),
    Promise = require('bluebird'),
    queue = new BlueBirdQueue({
        concurrency: 3 // optional, how many items to process at a time
    });

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var task1 = function(data) {
    var jobName = data.jobName;
    return new Promise(function(resolve, reject) {
        var timeout = getRandomInt(1,10);
        if(timeout === 5) {
            reject('[' + jobName + '] Task 1 - failed')
        } else {
            setTimeout(function () {
                console.log('[' + jobName + '] Task 1 - complete ' + timeout + 'ms');
                data.task1 = timeout;
                resolve(data);
            }, timeout);
        }
    });
};
var task2 = function(data) {
    var jobName = data.jobName;
    return new Promise(function(resolve, reject) {
        var timeout = getRandomInt(100,200);
        setTimeout(function() {
            console.log('[' + jobName + '] Task 2 - complete ' + timeout + 'ms');
            data.task2 = timeout;
            resolve(data);
        }, timeout);
    });
};
var task3 = function(data) {
    var jobName = data.jobName;
    return new Promise(function(resolve, reject) {
        var timeout = getRandomInt(200,400);
        setTimeout(function() {
            console.log('[' + jobName + '] Task 3 - complete ' + timeout + 'ms');
            data.task3 = timeout;
            resolve(data);
        }, timeout);
    });
};
var job = function(jobName) {
    var data = {jobName: jobName};
    return task1(data)
        .then(task2)
        .then(task3).
        catch(function(error) {
            console.log(error);
        });
};

// only create a reference to the function, don't actually call it.
var jobs = [];
for (var i = 1; i <= 10; i++) {
    jobs.push('Job' + i);
}
//jobs.forEach(function(e) {
//    job(e);
//
//});

jobs.forEach(function(e) {
    queue.add(function() {
        return job(e);
    });
});
queue.start()
    .then(function(results) {
        console.log('Queue complete.');
        console.log(results);
    });
