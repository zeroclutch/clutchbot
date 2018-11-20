module.exports = {
    name: 'extrathicc',
    usage: 'extrathicc <phrase>',
    aliases: [],
    description: 'Converts your text to 乇乂丅尺卂 丅卄工匚匚',
    category: 'fun',
    permissions: [],
    args: true,
    run: function(msg, args) {
        const initial = args.join(" ").toLowerCase()
        var text = ' '
        const thiccText = '卂乃匚刀乇下厶卄工丁长乚从ㄇ口尸㔿尺丂丅凵リ山乂丫乙'
        const english = 'abcdefghijklmnopqrstuvwxyz'
        for (var i = 0; i < initial.length; i++) {
            const letter = initial[i];
            if(english.includes(letter)) text += thiccText[english.indexOf(letter)]
            else text += letter
        }
        msg.channel.sendMsgEmbed(text)
    }
  }