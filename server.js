
// turn off limits by default (BE CAREFUL)
require('events').EventEmitter.prototype._maxListeners = 0;

const net = require('net');
const port = '44666';
const host = '0.0.0.0';
const clientHost = '127.0.0.1';
const clientPort = '43666';

var demo_data = "�0421F23E0495ABE081200000004204000022165321550400409731312000000000000000061510555673737716504008092304042000000C00000000C000000000653215506111111245321550400409731=23042210000032982606822110300022100000000000022HAGGAI  MFB  ATM  GARKI     ABUJA   LANG56600440210100003298260020073737706151055560000053215500000111111000000000000000000000000C00000000C0000000010002395301701551120151114C0020013646420144000000000100003298260PAT2src     PAT2snk     737377737377UBPGroup    301000032982602020061501252218Postilion:MetaData278211MediaTotals111212MediaBatchNr111217AdditionalEmvTags111214AdditionalInfo111211MediaTotals3116<MediaTotals><Totals><Amount>0</Amount><Currency>000</Currency><MediaClass>Cards</MediaClass></Totals></MediaTotals>212MediaBatchNr173736441217AdditionalEmvTags3500<AdditionalEmvTags><EmvTag><TagId>50</TagId><TagValue>4465626974204D617374657243617264</TagValue></EmvTag><EmvTag><TagId>81</TagId><TagValue>0000C350</TagValue></EmvTag><EmvTag><TagId>9F4C</TagId><TagValue>0000000000000000</TagValue></EmvTag><EmvTag><TagId>9F45</TagId><TagValue>0000</TagValue></EmvTag><EmvTag><TagId>5F36</TagId><TagValue>00</TagValue></EmvTag><EmvTag><TagId>5F34</TagId><TagValue>00</TagValue></EmvTag><EmvTag><TagId>9B</TagId><TagValue>6000</TagValue></EmvTag></AdditionalEmvTags>214AdditionalInfo3447<AdditionalInfo><Transaction><OpCode>AGABHAIA</OpCode><BufferB>08136900929</BufferB><BufferC>1774691015</BufferC><CfgExtendedTrxType>8505</CfgExtendedTrxType><CfgReceivingInstitutionIDCode>62805112345</CfgReceivingInstitutionIDCode></Transaction><Download><ATMConfigID>5006</ATMConfigID><AtmAppConfigID>5006</AtmAppConfigID><LoadsetGroup>FEP Wincor EMV</LoadsetGroup><DownloadApp>QT3_DOWNLOAD_WESTERNUNION</DownloadApp></Download></AdditionalInfo>07PAT2snk";
var demo_data2 = "s0200F23E04D5A9E08120000000000400002216532155040040973131200000000000000006161524027373771650400809230404200000012C00000000C000000000653215506111111245321550400409731=230422100000329828722110300022100000000000022HAGGAI  MFB  ATM  GARKI     ABUJA   LANG5660041510010000329828710002395301701551120151114C0020013416000140000000000100003298287PAT2src     PAT2snk     737377737377UBPGroup    2020061601252211MediaTotals3116<MediaTotals><Totals><Amount>0</Amount><Currency>000</Currency><MediaClass>Cards</MediaClass></Totals></MediaTotals>218Postilion:MetaData278211MediaTotals111212MediaBatchNr111217AdditionalEmvTags111214AdditionalInfo111212MediaBatchNr173736441217AdditionalEmvTags3500<AdditionalEmvTags><EmvTag><TagId>50</TagId><TagValue>4465626974204D617374657243617264</TagValue></EmvTag><EmvTag><TagId>81</TagId><TagValue>0000C350</TagValue></EmvTag><EmvTag><TagId>9F4C</TagId><TagValue>0000000000000000</TagValue></EmvTag><EmvTag><TagId>9F45</TagId><TagValue>0000</TagValue></EmvTag><EmvTag><TagId>5F36</TagId><TagValue>00</TagValue></EmvTag><EmvTag><TagId>5F34</TagId><TagValue>00</TagValue></EmvTag><EmvTag><TagId>9B</TagId><TagValue>6000</TagValue></EmvTag></AdditionalEmvTags>214AdditionalInfo3447<AdditionalInfo><Transaction><OpCode>AGABHAIA</OpCode><BufferB>08136900929</BufferB><BufferC>1774691015</BufferC><CfgExtendedTrxType>8505</CfgExtendedTrxType><CfgReceivingInstitutionIDCode>62805112345</CfgReceivingInstitutionIDCode></Transaction><Download><ATMConfigID>5006</ATMConfigID><AtmAppConfigID>5006</AtmAppConfigID><LoadsetGroup>FEP Wincor EMV</LoadsetGroup><DownloadApp>QT3_DOWNLOAD_WESTERNUNION</DownloadApp></Download></AdditionalInfo>";

const server = net.createServer();
const client = new net.Socket();



server.listen(port, host, () => {
    console.log('TCP server is running on port ' + port + '.');
});

let sockets = [];

server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);


    sockets.push(sock);
    sock.setEncoding("utf8");


    sock.on('data', function(data) {
        
        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(sock, index, array) {


            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
        });
    });


    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {



        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        });
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });






});


let data_id = "requestId_" + makeid(5) + new Date().getTime();

client.connect({
    port: clientPort,
    host: clientHost,
});


console.log(data_id + " data to send: " +demo_data2);
client.write(demo_data2 +"\n");
console.log(data_id +": data sent to socket server, waiting for response.");





client.on('connect', function() {
    console.log("connected to socket server running on ip " + clientHost + " and port " +clientPort);
});

client.on('data', function(data) {

    let received = "";
    received += data.toString();


    const messages = received.split("\n");

    if (messages.length > 0) {

        for (let message of messages) {
            if (message !== "") {


                console.log("response from socket server: " +message);


                received = ""
            }
        }
    }


});

client.on('error', function(ex) {


    console.log("error connecting to socket server: " +ex);

    client.destroy();


});


client.on('close', function() {

    console.log("socket server connection closed");

    client.removeAllListeners();
    client.destroy();


});

client.on('end', function() {

    console.log("socket server connection ended");


});




function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}




