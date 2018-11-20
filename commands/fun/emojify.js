const translator = require('moji-translate')
module.exports = {
    name: 'emojify',
    usage: 'emojify <phrase>',
    aliases: [],
    description: 'Makes your message an emoji-fest',
    category: 'fun',
    permissions: [],
    args: true,
    loader: true,
    run: function(msg, args) {
        var text = ''
        args.forEach(word => {
            const emoji = translator.getEmojiForWord(word)
            if (emoji) text += `${word} ${emoji} `
            else text += `${word} `
        })
        msg.channel.sendMsgEmbed(text)
    }
  }