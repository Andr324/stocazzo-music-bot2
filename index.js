const Discord = require("discord.js")
const client = new Discord.Client()

client.login(process.env.token)
const DisTube = require("distube") //Dopo aver fatto npm install distube

const config = {
    prefix: "a!", //prefisso
    token: "process.env.token" //token
}

const distube = new DisTube(client, {
    emitNewSongOnly: true, highWaterMark: 1 << 50, leaveOnEmpty: true, leaveOnFinish: true, leaveOnStop: true, searchSongs: false, customFilters:
    {
        "bassboost": "bass=g=20,dynaudnorm=f=200",
        "8d": "apulsator=hz=0.08",
        "vaporwave": "aresample=48000,asetrate=48000*0.8",
        "nightcore": "aresample=48000,asetrate=48000*1.25",
        "phaser": "aphaser=in_gain=0.4",
        "subboost": "asubboost",
        "bassboost": "bass=g=20,dynaudnorm=f=200",
    }
})

const filters = ["3d", "bassboost", "echo", "karaoke", "nightcore", "vaporwave", "flanger", "subboost"]

client.on("message", async (message) => {
    if (message.author.bot) return
    if (!message.content.startsWith(config.prefix)) return
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const command = args.shift()

    if (command == "play") {
        if (!message.member.voice.channel) return message.channel.send ("Non puoi utilizzare il comando `f!play` se non sei collegato in un canale vocale!")
        embedbuilder(client, message, "#c219d8", "Cercando... - YouTube")
        return distube.play(message, args.join(" "))
    }

    if (command == "stop") {
        if (!message.member.voice.channel) return message.channel.send ("Non puoi utilizzare il comando `f!stop` se non sei collegato in un canale vocale!")
        embedbuilder(client, message, "RED", "STOP", "LA CANZONE E' STATA STOPPATA")
        return distube.stop(message)
    }

    if (command == "volume") {
        if (!message.member.voice.channel) return message.channel.send ("Non puoi utilizzare il comando `f!volume` se non sei collegato in un canale vocale!")
        embedbuilder(client, message, "#c219d8", "VOLUME", `Il volume è stato impostato fino al \`${args[0]} %\``)
        distube.setVolume(message, args[0])
    }

})

function embedbuilder(client, message, color, title, description, thumbnail) {
    let embed = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor(message.author.tag, message.member.user.displayAvatarURL({ dynamic: true }))
        .setFooter(client.user.username, client.user.displayAvatarURL())
    if (title) embed.setTitle(title)
    if (description) embed.setDescription(description)
    if (thumbnail) embed.setThumbnail(thumbnail)
    return message.channel.send(embed)
}

