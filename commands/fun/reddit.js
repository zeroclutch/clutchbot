const snoowrap = require('snoowrap')
const Discord = require('discord.js')
const url = require('url');

module.exports = {
    name: 'reddit',
    usage: 'reddit <subreddit> <search term or -random or -time=day/month/year/all (optional)>',
    aliases: [],
    description: 'Finds a hot reddit post from a specified subreddit, or a specific post if you search it.',
    category: 'fun',
    permissions: [],
    args: true,
    loader: true,
    run: function(msg, args) {
        // TODO: generate one snoowrap globally instead of creating a new instance each time
        const r = new snoowrap({
            userAgent: 'ClutchBot v0.1 (by /u/mrprgr)',
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD
        });

        function isValidURL(url) {
            try {
                new URL(url);
                return true;
            } catch (err) {
                return false;  
            }
        }

        function getTagValue(tagName) {
            let tagStart = msg.content.indexOf(tagName)
            let trailingSpace = msg.content.indexOf(' ', msg.content.indexOf(tagName))
            let tagEnd = trailingSpace > 0 ? trailingSpace : msg.content.length
            return msg.content.substring(tagStart, tagEnd).replace(tagName + '=', '')
        }

        function sendReply(submission) {
            //console.log(submission.toJSON())
            if(submission.over_18 && !msg.channel.nsfw) {
                msg.channel.sendMsgEmbed('The selected post is NSFW. Try this command again in a NSFW channel.', 'Sorry...')
            //} else if(submission.pinned) {
                // find a new post if the current one is pinned
                // getPost()
            } else {
                var content = ''
                var embed = new Discord.RichEmbed().setTitle(submission.title)
                embed.setDescription(submission.toJSON().selftext ? submission.toJSON().selftext.substring(0, Math.min(submission.toJSON().selftext.length, 2048 - (19 + submission.url.length))) + `\n**[Permalink](${submission.url})**` : `**[View post here.](${submission.url})**`)
                embed.setURL("https://reddit.com" + submission.permalink)
                embed.setFooter(`${submission.score} ${submission.score === 1 ? 'upvote' : 'upvotes'}`, 'https://cdn.discordapp.com/emojis/492254092887064578.png')
                embed.setTimestamp(new Date(submission.created * 1000))
                embed.setColor(4513714)
                
                // domains that discord automatically embeds from using post link
                const autoEmbeds = ['gfycat.com', 'youtube.com', 'youtu.be']

                const platinum =   submission.total_awards_received > 2 ? msg.client.emojis.find(emoji => emoji.id === '611056466941444109') : ''
                const gold =     submission.total_awards_received > 1 ? msg.client.emojis.find(emoji => emoji.id === '611056466971066379') : ''
                const silver = submission.total_awards_received > 0 ? msg.client.emojis.find(emoji => emoji.id === '611056466736185345') : ''

                // get metadata
                if(submission.total_awards_received > 0) embed.addField('Awards:', `${submission.total_awards_received} ${platinum} ${gold} ${silver}`)

                // set thumb
                if(isValidURL(submission.thumbnail)) embed.setThumbnail(submission.thumbnail)

                // set image
                if(submission.url.endsWith('.jpg') || submission.url.endsWith('.png') || submission.url.endsWith('.gif') || submission.url.endsWith('.jpeg') ) embed.setImage(submission.url)
                if(submission.post_hint == 'image') embed.setImage(submission.url)

                // set content
                if(submission.is_video) content = submission.url
                if(submission.post_hint == 'rich:video') content = submission.url
                if(autoEmbeds.includes(submission.domain)) content = submission.url

                if(content) msg.channel.send(content)
                msg.channel.send(embed)
                .then(msg => {
                    msg.react(msg.client.emojis.find(emoji => emoji.id === '492248537644531722'))
                    .then(() => {
                        msg.react(msg.client.emojis.find(emoji => emoji.id === '492248331356209162'))
                    })
                })
            }
        }

        //function getPost() {
            if(!args || args.length === 0) {
                msg.channel.sendMsgEmbed('Please enter the subreddit you wish to search!')
            } else if (args.length === 1) {
                r.getSubreddit(args[0]).getHot()
                .then(listing => {
                    sendReply(listing[Math.floor(Math.random()*listing.length)])
                })
                .catch(err => {
                    console.error(err)
                    msg.channel.send('', { 
                        "embed": {
                            "color": 0xfd171c,
                            "description": 'No results found.',
                        }
                    })
                })
            } else if(args.join(' ').includes('-random')) {
                r.getSubreddit(args[0]).getRandomSubmission()
                .then(post => {
                    sendReply(post)
                })
                .catch(err => {
                    console.error(err)
                    msg.channel.send('', { 
                        "embed": {
                            "color": 0xfd171c,
                            "description": 'No results found.',
                        }
                    })
                })
            } else if(args.join(' ').includes('-time')) {
                r.getSubreddit(args[0]).getTop({time: getTagValue('-time') || 'all'})
                .then(posts => {
                    const submission = posts[Math.floor(Math.random()*posts.length)]
                    sendReply(submission)
                })
                .catch(err => {
                    console.error(err)
                    msg.channel.send('', { 
                        "embed": {
                            "color": 0xfd171c,
                            "description": 'No results found.',
                        }
                    })
                })
            } else {
                r.getSubreddit(args[0]).search({query: args.slice(1).join(" "), sort: 'relevance'})
                .then(listing => {
                    const submission = listing[0]
                    if(submission) {
                        sendReply(submission)
                    } else {
                        msg.channel.send('', { 
                            "embed": {
                                "color": 0xfd171c,
                                "description": 'No results found.',
                            }
                        })
                    }
                })
                .catch(err => {
                    console.error(err)
                    msg.channel.send('', { 
                        "embed": {
                            "color": 0xfd171c,
                            "description": 'No results found.',
                        }
                    })
                })
            }

            //getPost()
        
        //}
    }
  }
