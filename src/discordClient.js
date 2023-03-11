const { Client, IntentsBitField } = require('discord.js');

class DiscordClient {
    constructor(token) {
        this.connected = false;
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildPresences
            ],
        });
        this.client.login(token);
        this.client.on('messageCreate', this.onMessage.bind(this));
        this.client.on('ready', this.onReady.bind(this));
    }

    onReady() {
        console.log('Ready!');
        this.connected = true;
    }

    onMessage(message) {
        if (message.author.bot) return; //ignore bot messages

        console.log(message.author.username + ': ' + message.content);
    }

    async sendImage(channel, image) {
        const attachment = new Discord.MessageAttachment(image, 'image.png');
        await channel.send({ files: [attachment] });
    }

    async sendEmbed(channel, embed) {
        await channel.send({ embeds: [embed] });
    }

    //sent text to a discord channel
    async sendText(channel, text) {
        channel.send(text);
    }
    //send text and a clode block to a discord channel
    async sendTextAndJson(channel, text, codeText) {
        channel.send(text + '\n```json\n' + codeText + '```');
    }



    //get channel by name
    getChannelByName(name) {
        return this.client.channels.cache.find(channel => channel.name === name);
    }
}

module.exports = { DiscordClient };