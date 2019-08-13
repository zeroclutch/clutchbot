const translate = require('google-translate-api')
const languages = require('../../data/utility/languages')
 
module.exports = {
    name: 'translate',
    usage: 'translate <endlanguage> <phrase>',
    aliases: ['t', 'trans'],
    description: `Translates text to any language. Use \`tl\` for the list of valid languages`,
    category: 'utility',
    permissions: [],
    args: true,
    loader: true,
    run: function(msg, args) {
        const endlanguage = args[0].toLowerCase()
        phrase = args.slice(1).join(" ")

        translate(phrase, {from: 'auto', to: endlanguage})
        .then(res => {
            msg.channel.sendMsgEmbed(res.text, `Translation from ${languages[res.from.language.iso]}\`[${res.from.language.iso}]\` to ${languages[endlanguage]}\`[${endlanguage}]\``);
        }).catch(err => {
            console.error(err);
            msg.channel.sendMsgEmbed(`Make sure you\'re using valid language codes. See ${msg.prefix}tl for the list of valid languages.`, 'Translation failed', 13632027)
            msg.channel.stopTyping(true)
        });
    }
  }

