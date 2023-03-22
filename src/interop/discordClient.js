const { Client, IntentsBitField, REST, Routes } = require('discord.js');
require('dotenv').config();

class DiscordClient {
    constructor(token) {
        this.connected = false;
        this.token = token;
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildPresences
            ],
        });
        this.client.login(this.token);
        this.client.on('messageCreate', this.onMessage.bind(this));
        this.client.on('ready', this.onReady.bind(this));
        this.client.on('interactionCreate', this.onInteraction.bind(this));

        this.commands = {};
    }

    async registerNewCommand(name, description, handlerFunction) {
        this.commands[name] = { name, description, handlerFunction };

        // body needs to be just an array of the commands name  and description
        const bodyCommands = [];
        for (const command in this.commands) {
            bodyCommands.push({ name: this.commands[command].name, description: this.commands[command].description });
        }

        const rest = new REST({ version: '10' }).setToken(this.token);
        try {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: bodyCommands },
            );
            console.log(`Successfully registered application command "${name}".`);
        } catch (error) {
            console.error(error);
        }
    }

    onInteraction(interaction) {
        if (!interaction.isCommand()) return;

        const handlerFunction = this.commands[interaction.commandName].handlerFunction;

        if (handlerFunction) {
            handlerFunction(interaction);
        } else {
            console.log(`No registered handler for command: ${interaction.commandName}`);
        }
    }

    onReady() {
        console.log('Ready!');
        this.connected = true;

    }

    onMessage(message) {
        if (message.author.bot) return; //ignore bot messages

        console.log(message.author.username + ': ' + message.content);
    }

    registerMessageHandler(handler) {
        this.client.on('messageCreate', handler);
    }

    async sendImage(channel, image) {
        // const attachment = new Discord.MessageAttachment(image, 'image.png');
        const attachment = { name: 'image.png', attachment: image };
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