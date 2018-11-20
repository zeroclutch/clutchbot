module.exports = {
  name: 'eval',
  usage: 'eval',
  aliases: [],
  description: 'Test code',
  category: 'dev',
  permissions: ["GOD"],
  args: true,
  run: async function(msg, args) {
    var response = '';
    try {
      response += await eval('(function(){'+msg.content.substring(6,msg.content.length)+'})();')
      msg.channel.sendMsgEmbed("*eval completed*\nResponse Time: `" + (Date.now()-msg.createdTimestamp) + "ms`\nresponse:```json\n" + JSON.stringify(response) + "```");
    } catch (err) {
      msg.channel.sendMsgEmbed("*eval failed*\nResponse Time: `" + (Date.now()-msg.createdTimestamp) + "ms`\nerror:```json\n" + err.message + "```");
    }
  }
}