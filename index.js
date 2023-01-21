const { Client, IntentsBitField } = require('discord.js');
const fs = require('fs');

const logger = require('./logger');

require('dotenv').config();
const isDebugEnabled = process.env.DEBUG === 'true';

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildEmojisAndStickers]
});

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('con emojis :)', { type: 'PLAYING' });

    // load events from the events folder
    fs.readdir('./events/', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            const event = require(`./events/${file}`);
            let eventName = file.split('.')[0];
            logger.info(`Loading Event: ${eventName}`);
            client.on(eventName, (...args) => {
                try {
                    event.bind(client, ...args);
                } catch (error) {
                    logger.error(error);
                }
            });
            delete require.cache[require.resolve(`./events/${file}`)];
        });
    });
    
    // load slash commands from the commands folder
    client.commands = new Map();
    fs.readdir('./commands/', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            const cmd = require(`./commands/${file}`);
            let commandName = file.split('.')[0];
            logger.info(`Loading Command: ${commandName}`);
            client.commands.set(commandName, cmd);

            // register slash command globally
            client.application.commands.create({
                name: commandName,
                ...cmd.data
            });
        });
    });
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        logger.verbose(`${interaction.user.tag} executed command ${interaction.commandName}`, isDebugEnabled);
        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

    if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        if (!button) return;

        logger.verbose(`${interaction.user.tag} pressed button ${interaction.customId}`, isDebugEnabled);
        try {
            await button.execute(interaction);
        } catch (error) {
            logger.error(error);
            await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);