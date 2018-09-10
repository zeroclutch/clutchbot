module.exports = {
  name: 'eval',
  usage: 'eval',
  aliases: [],
  description: 'Test code',
  category: 'dev',
  permissions: ["GOD"],
  args: true,
  run: function(msg, args) {
    var response = '';
    try {
      response += eval('(function(){'+msg.content.substring(6,msg.content.length)+'})();')
      msg.channel.send("*eval completed*\nResponse Time: `" + (Date.now()-msg.createdTimestamp) + "ms`\nresponse:```json\n" + JSON.stringify(response) + "```");
    } catch (err) {
      msg.channel.send("*eval failed*\nResponse Time: `" + (Date.now()-msg.createdTimestamp) + "ms`\nerror:```json\n" + err.message + "```");
    }
  }
}