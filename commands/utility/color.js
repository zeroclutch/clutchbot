const Discord = require('discord.js')
const { createCanvas, registerFont } = require('canvas')
const fs = require('fs')

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
  
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
  
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
  
      h /= 6;
    }
  
    return [ h, s, l ];
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

module.exports = {
    name: 'color',
    usage: 'color <hex code/rgb code/hsl code>',
    aliases: ['col'],
    description: 'Gets a color based on a hex code (#FFFFFF), RGB value (rgb(255,255,255), or HSL value (hsl(0,0,100)).',
    category: 'dev',
    permissions: ["GOD"],
    args: false,
    run: function(msg, args) {
        const color = args.join(' ')


        const canvas = createCanvas(200, 100)
        const ctx = canvas.getContext('2d')
        
        // add bg
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const rgbColor = ctx.getImageData(0, 0, 1, 1).data
        const hslColor = rgbToHsl(rgbColor[0], rgbColor[1], rgbColor[2])
        const hexColor = rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2])

        const fileName = Math.round(Math.random()*1000000) + '.png'
        const filePath = `./assets/temp/${fileName}`
        const out = fs.createWriteStream(filePath)
        const stream = canvas.createPNGStream()
        stream.pipe(out)
        
        out.on('finish', () =>  {
            console.log(rgbColor.slice(0,-1))
            const embed = new Discord.RichEmbed()
            .setTitle(`Color Picker - ${color.toUpperCase()}`)
            .attachFiles([filePath])
            .addField('HEX', hexColor)
            .addField('HSLA', `${Math.round(hslColor[0] * 360)}°, ${Math.round(hslColor[1] * 100)}%, ${Math.round(hslColor[2] * 100)}%, ${Math.round(rgbColor[3] / 255 * 100) / 100}`)
            .addField('RGBA', rgbColor.join(', '))
            .setImage(`attachment://${fileName}`)
            .setColor(Array.prototype.slice.call(rgbColor.slice(0,-1)))
            msg.channel.send(embed)
            .then(() => fs.unlinkSync(filePath))
        }) 
    }
  }