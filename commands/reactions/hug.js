const client = require('nekos.life');
const neko = new client();
module.exports = {
    name: 'hug',
    usage: 'hug <user>',
    aliases: [],
    description: 'Give someone a hug! Awwww :)',
    category: 'reactions',
    permissions: [],
    args: true,
    loader: true,
    run: async function(msg, args) {
        const userID = args[0].replace(/\D/g, '')
        const image = await neko.getSFWHug()

        // check for valid user
        var otherPerson = args.join(" ")
        if(userID == msg.author.id) {
            otherPerson = 'themself'
        } else if(msg.guild.member(`${userID}`)) {
            otherPerson = `<@${userID}>`
        }
        msg.channel.send('', {
            embed: {
                color: 4513714,
                description: `*<@${msg.author.id}> hugs ${otherPerson}*`,
                image
            }
        })
    }
}