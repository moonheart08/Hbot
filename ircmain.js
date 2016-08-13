var irc = require('irc');
var client = new irc.Client('irc.freenode.net', 'hbot', {
    channels: ['#hbot','##powder-bots','#bots'],
    floodProtection: true,
    autoRejoin: true,

});
var math = require("mathjs");
var weather = require('weather-js');
var config = {
  bignumbers: true,
  precision: 64,
  prefix: "",
  nick: "hbot",
  rejoinmsg: "springs right back up",
}
require("irc-colors").global()
var c = require("irc-colors");
math.config({
  number: 'BigNumber',  // Default type of number:
                      // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 32        // Number of significant digits for BigNumbers
});
var parser = math.parser();
function calculator(expression) {
  try {
    return math.format(parser.eval(expression),512);
  } catch (er) {
    return er;
  }
}
client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);
    var mdata = c.stripColorsAndStyle(message).split(" ");
    var cmd = mdata.shift();
    var rest = mdata.join(" ");
    switch (cmd.toLowerCase()) {
      case config.prefix+"say":
          if (rest == "moo" && config.not_going_to == true) {
            client.say(to,"Fine, ill moo.")
          }
          client.say(to,"-"+rest);
        break;
      case config.prefix+"calculate":
          client.say(to,calculator(rest))
        break;
      case config.prefix+"toggle":
          switch (mdata[0].toLowerCase()) {
            case "bignumbers":
                if (config.bignumbers == true) {
                  config.bignumbers = false;
                  math.config({
                    number: 'number'
                  })
                  client.say(to,"Bignumbers disabled")
                } else {
                  config.bignumbers = true;
                  math.config({
                    number: 'BigNumber'
                  })
                  client.say(to,"Bignumbers enabled")
                }
              break;
            default:

          }
        break;

    case config.prefix+"set":

        switch (mdata[0].toLowerCase()) {
          case "precision":
            if (mdata[1] != "to") return;
            try {
              math.config({
                precision: parseInt(mdata[2])
              })
              client.say(to,"Precision set to "+mdata[2]);
            } catch (err) {
              client.say(err);
            }
            break;
          case "prefix":
              if (mdata[1] != "to") return;
              if (!mdata[2]) {
                config.prefix = "";
                client.say(to,"Prefix cleared");
                return;
              }
              config.prefix = mdata[2]
              client.say(to,"Prefix set to "+mdata[2]);
            break;
          case "rejoin":
              if (mdata[1] == "message" && mdata[2] == "to") {
                var mdatac = mdata;
                mdatac.shift();mdatac.shift();mdatac.shift();
                var str = mdata.join(" ");
                config.rejoinmsg = str;
                client.say(to,"Rejoin message set to"+config.rejoinmsg);
              }
          default:

        }
        break;
    case config.prefix+"clear":
        switch (mdata[0].toLowerCase()) {
          case "prefix":
              config.prefix = "";
              client.say(to,"Prefix cleared");
            break;
          default:

        }
      break;
    case config.prefix+"weather":
        var mdatac = mdata;
        if (!mdata[0]) return;
        if (mdatac.shift().toLowerCase() == "in") {
          if (mdatac.join(" ") == "##chat") {
            client.say(to,"Very hot, with a hint of saltiness");
            return;
          } else if (mdatac.join(" ") == "#powder") {
            client.say(to,"Perfect, perfect, and a bit inside the box");
          }
          weather.find({search: mdatac.join(" "), degreeType: 'F'},function (err, weather) {
            if (err) {
              client.say(to, err);
              return;
            }
            client.say(to,"Weather in "+weather[0].location.name);
            client.say(to,"it is "+weather[0].current.temperature+" fahrenheit, and it feels like "+weather[0].current.feelslike+" fahrenheit");
            client.say(to,"it is "+weather[0].current.skytext+", and the humidity is "+weather[0].current.humidity);
            client.say(to,"the wind speed and direction is "+weather[0].current.winddisplay);
          });
        }
      break;
    case config.prefix+"shorten":
      var TinyURL = require('tinyurl');
      TinyURL.shorten(mdata[0], function(res) {
        client.say(to,"Here is the shortened url: "+res);
      });
      break;
    case config.prefix+"help":
        if (!mdata[0] || !mdata[0].toLowerCase() == "with" || !mdata[0].toLowerCase() == "on" || !mdata[1]) return;
        switch (mdata[1].toLowerCase()) {
          case "calculate":
              client.say(to,"the Calculator uses mathjs for its operations, for everything it supports, see http://mathjs.org/docs/index.html");
            break;
          default:

        }
      break;
    case config.prefix+"moo":
        config.not_going_to = true;
        client.say(to,"No, im not going to.");
      break;
    /*case config.prefix+"search":
        if (!mdata[0] || !mdata[1] || !mdata[2] || !mdata[1] == "for") return;
        console.log(mdata);
        wiki = new MediaWikiApi(mdata[0]);
        var mdatac = mdata;
        mdatac.shift(); mdatac.shift();
        var searchstr = mdatac.join(" ");
        console.log("searchstr: "+searchstr);
        wiki.search(searchstr, {
          limit: 5,
          what: "text"
        }).on("result", function (articles) {
            console.log("articles: "+JSON.stringify(articles));
            client.say(to,articles[0].title+"\n"+articles[0].snippet);
        });
        break;*/
      case "rainbowify":

          client.say(to,rest.irc.rainbow());
        break;
      case "zalgoify":
          client.say(to,require('to-zalgo')(rest));
        break;
      case "ralgoify":
        
        client.say(to,require('to-zalgo')(rest,{middle: true,size: 'mini'}).irc.rainbow());
      break;
      case "verify":
        if (mdata[0] == "as" && mdata[1] == "owner") {
          client.whois(from, function (info) {
            console.log(info);
            if (info.account == "MoonyTheDwarf") {
              client.say(to,"You are my owner!");
            }
          })
        }
      break;
      case "evaluate":
        client.whois(from, function (info) {
          console.log(info);
          if (info.account == "MoonyTheDwarf") {
            console.log("Accepted as owner");
            client.say(to,(function(){
              try {
                return eval(rest);
              } catch (er) {
                return er;
              }
            })());
          }
        });
        break;
      case "rainbow":
        client.say(to,"███████\n███████\n███████\n███████\n███████\n███████\n███████\n███████".irc.rainbow());
        break;
        
    }
  });
client.on('error',function(err) {
  console.log("something went wrong");
})
client.on('kick',function(channel,nick,by,reason,message) {
  console.log("kick: "+channel+" "+nick+" "+by+" "+reason+" "+message)
  if (nick == config.nick) {
    console.log("Autorejoining");
    client.join(channel);
    client.action(channel,config.rejoinmsg);
  }
})
client.on('invite',function(chan,from,message) {
  client.join(chan);
});
require("./sandbox.js")(client);