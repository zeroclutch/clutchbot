const snoowrap = require('snoowrap')
module.exports = {
    name: 'reddit',
    usage: 'reddit <subreddit> <search (optional)>',
    aliases: [],
    description: 'Finds a hot reddit post from a specified subreddit, or a specific post if you search it.',
    category: 'fun',
    permissions: [],
    args: false,
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

        function sendReply(submission) {
            msg.channel.send('', { 
                "embed": {
                    "color": 4513714,
                    "title": submission.title,
                    "description": submission.toJSON().selftext.substring(0, Math.min(submission.toJSON().selftext.length, 2048 - (19 + submission.url.length))) + `\n**[Permalink](${submission.url})**`,
                    "url": "https://reddit.com" + submission.permalink,
                    "thumbnail": {
                        url: submission.thumbnail != 'self' ? submission.thumbnail : 'https://cdn.discordapp.com/emojis/492254092887064578.png',
                    },
                    "image": { 
                        url: submission.post_hint == 'image' ? submission.url : 'https://cdn.discordapp.com/emojis/492254092887064578.png',
                    },
                    "footer": {
                        "icon_url": "https://cdn.discordapp.com/emojis/492254092887064578.png",
                        "text": `${submission.score} ${submission.score === 1 ? 'upvote' : 'upvotes'} | ${new Date(submission.created * 1000).toLocaleDateString('en')}`
                    },
                    "fields": [
                        {
                            name: 'Awards:',
                            value: `${submission.gilded}`
                        }
                    ],
                }
            })
            .then(msg => {
                msg.react(msg.client.emojis.find(emoji => emoji.id === '492248537644531722'))
                .then(() => {
                    msg.react(msg.client.emojis.find(emoji => emoji.id === '492248331356209162'))
                })
            })
        }

        if(!args || args.length === 0) {
            msg.channel.sendMsgEmbed('Please enter the subreddit you wish to search!')
        } else if (args.length === 1) {
            r.getSubreddit(args[0]).getHot()
            .then(submission => {
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
                console.log(submission)
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
    }
  }
