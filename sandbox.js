var c = require("irc-colors");
module.exports = (client) => {
    var SandCastle = require('sandcastle').SandCastle;
    var sandcastle = new SandCastle();
    client.on('message',(from,to,message) => {
        var mdata = c.stripColorsAndStyle(message).split(" ");
        var cmd = mdata.shift();
        var rest = mdata.join(" ");
        switch (cmd.toLowerCase()) {
              case "sandbox":
                  var script = sandcastle.createScript(rest);
                  script.on('exit', function(err, output) {
                      try {
                     if (output) { 
                         output = output.replace(/[\n\r\7]/g, "");
                         output = output.substring(0,500);
                        client.say(to,output);
                     }
                     if (err) {
                         var ermsg = err.message.replace(/[\n\r\7]/g, "");
                         client.say(from,ermsg+"\n"+err.stack);
                         client.say(to,ermsg);
                     }
                      } catch (err) {
                          console.log(err);
                      }
                  });
                  script.on('timeout', function() {
                     console.log('Timed out');
                  });
                  script.run();
                  break;
        }
    });
};
