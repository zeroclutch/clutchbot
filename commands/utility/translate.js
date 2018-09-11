const translate = require('google-translate-api')
const options = require('../../config/options')
const languages = require('../../data/utility/languages')
 
module.exports = {
    name: 'translate',
    usage: 'translate <startlanguage> <endlanguage> <phrase>',
    aliases: ['trans'],
    description: `Translates text to and from any language. Use "auto" as the start language to detect language. Use \`${options.prefix}tl\` for the list of valid languages`,
    category: 'utility',
    permissions: [],
    args: true,
    run: function(msg, args) {
        const startlanguage = args[0].toLowerCase(),
        endlanguage = args[1].toLowerCase(),
        phrase = args.slice(2).join(" ")

        translate(phrase, {from: startlanguage, to: endlanguage})
        .then(res => {
            msg.channel.send(`Translation from ${languages[res.from.language.iso]}\`[${res.from.language.iso}]\` to ${languages[endlanguage]}\`[${endlanguage}]\`:\n${res.text}`);
        }).catch(err => {
            console.error(err);
            msg.channel.send(`Translation failed. Make sure you\'re using valid language codes. See ${options.prefix}tl for the list of valid languages.`)
        });
    }
  }

