const languages = require('../../data/utility/languages');

module.exports = {
    name: 'translationlist',
    usage: 'translationlist',
    aliases: ['tl'],
    description: `Provides a list of valid languages.`,
    category: 'utility',
    permissions: [],
    args: false,
    run: function(msg, args) {
        var text = '';
        for(var lang in languages) {
            text += `\`${lang}\`: ${languages[lang]}, `
        }
        msg.channel.send(text)
    }
  }

