const net = require('net');
const port = 43666;
const host = '0.0.0.0';
const fepHost = '10.154.0.12';
const fepPort = '49155';

const server = net.createServer();
const client = new net.Socket();

server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

let sockets = [];

server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', function(data) {
        client.connect(fepPort, fepHost, function() {
            console.log("Connected to patricia pay fep");
            client.write(data);
        })
        client.on('data', function(data) {
            console.log("Patricia Pay FEP: " + data);
        })
        client.on('close', function() {
            console.log("Patricia Pay FEP connection closed");
        });

        console.log('DATA ' + sock.remoteAddress + ': ' + data);

        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(sock, index, array) {

            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
        });
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});