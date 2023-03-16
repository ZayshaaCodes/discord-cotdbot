const { Client, IntentsBitField, REST, Routes } = require('discord.js');
require('dotenv').config();



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
        this.client.on('interactionCreate', this.onInteraction.bind(this));

        const commands = [
            {
                name: 'test',
                description: 'test command',
            }
        ];

        (async () => {
            const rest = new REST({ version: '10' }).setToken(token);
            try {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                    { body: commands },
                );
                console.log('Successfully registered application commands.');
            } catch (error) {
                console.error(error);
            }
        })();

    }

    onInteraction(interaction) {
        if (!interaction.isCommand()) return;
        console.log(interaction);
        if (interaction.commandName === 'test') {
            interaction.reply('test');
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