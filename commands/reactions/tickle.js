const client = require('nekos.life');
const neko = new client();
module.exports = {
    name: 'tickle',
    usage: 'tickle <user>',
    aliases: [],
    description: 'Tickle someone!',
    category: 'reactions',
    permissions: [],
    args: true,
    loader: true,
    run: async function(msg, args) {
        const userID = args[0].replace(/\D/g, '')
        const image = await neko.getSFWTickle()

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
                description: `*<@${msg.author.id}> tickles ${otherPerson}*`,
                image
            }
        })
    }
}