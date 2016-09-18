var serialport = require('serialport');
var request = require('request');

var port = new serialport.SerialPort('/dev/ttyO1', {
    parser: serialport.parsers.readline('\n'),
}, false);

port.open(function(error) {
    if (error) {
        console.log('Failed to open port:' + error);
    }

    console.log('Port opened!');

    port.on('data', function(data) {
        if (process.env.DEBUG) {
            console.log(data);
        }

        var json = JSON.parse(data);

        // Device ID(s) of temperature sensor(s)
        if (json.DEVICE[0].G === '0904' || json.DEVICE[0].G === '0404') {
            var form = json.DEVICE[0];
            form.TIMESTAMP = new Date().getTime();

            request({
                url: 'https://example.com',
                method: 'POST',
                form: form,
            });
        }
    });
});
