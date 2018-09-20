const snoowrap = require('snoowrap')
module.exports = {
    name: 'copypasta',
    usage: 'copypasta <search (optional)>',
    aliases: [],
    description: 'Finds a random copypasta, or a specific one if you search it.',
    category: 'fun',
    permissions: [],
    args: false,
    run: function(msg, args) {
        const r = new snoowrap({
            userAgent: 'ClutchBot v0.1 (by /u/mrprgr)',
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD
        });

        if(!args || args.length === 0) {
            r.getSubreddit('copypasta').getRandomSubmission()
            .then(submission => {
                msg.channel.send('', { 
                    "embed": {
                        "color": 4513714,
                        "description": submission.toJSON().selftext.substring(0, Math.min(submission.toJSON().selftext.length, 2048)),
                        "url": "https://reddit.com" + submission.permalink,
                        "footer": {
                            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
                            "text": `${submission.score} ${submission.score === 1 ? 'upvote' : 'upvotes'}`
                        },
                    }
                })
                .then(msg => {
                    msg.react('👍')
                    .then(() => {
                        msg.react('👎')
                    })
                })
            })
        } else {
            r.getSubreddit('copypasta').search({query: args.join(" "), sort: 'relevance'})
            .then(listing => {
                const submission = listing[0]
                if(submission) {
                    msg.channel.send('', { 
                        "embed": {
                            "color": 4513714,
                            "description": submission.toJSON().selftext.substring(0, Math.min(submission.toJSON().selftext.length, 2048)),
                            "url": "https://reddit.com" + submission.permalink,
                            "footer": {
                                "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
                                "text": `${submission.score} ${submission.score === 1 ? 'upvote' : 'upvotes'}`
                            },
                        }
                    })
                    .then(msg => {
                        msg.react('👍')
                        .then(() => {
                            msg.react('👎')
                        })
                    })
                } else {
                    msg.channel.send('', { 
                        "embed": {
                            "color": 0xfd171c,
                            "description": 'No results found.',
                        }
                    })
                }
            })
        }
    }
  }