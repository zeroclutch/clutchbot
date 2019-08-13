const client = require('nekos.life');
const neko = new client();
module.exports = {
    name: 'chatbot',
    usage: 'chatbot <phrase>',
    aliases: [],
    description: 'Ask a question or have a conversation with the bot',
    category: 'fun',
    permissions: [],
    loader: true,
    args: true,
    run: async function(msg, args) {
        var text = await neko.getSFWChat({text: args.join(' ')})
        msg.channel.sendMsgEmbed(text.response)
    }
  }