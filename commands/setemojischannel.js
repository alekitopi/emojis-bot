const { ApplicationCommandOptionType } = require('discord.js');

const logger = require('../logger.js');
const emojisMessage = require('../utils/emojisMessage.js');
const settingsManager = require('../utils/settingsManager.js');

module.exports = {
    data: {
        description: 'Establece el canal seleccionado como canal de emojis.',
        options: [
            {
                name: 'canal',
                description: 'Canal de texto donde se publicarán los emojis.',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }
        ]
    },
    async execute(interaction) {
        const channel = interaction.options.getChannel('canal');
        if (!channel) {
            await interaction.reply({ content: '`❌` Debes seleccionar un canal de texto.', ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const emojis = interaction.guild.emojis.cache;
        const emojisText = emojisMessage(emojis);

        try {
            await channel.send(emojisText);

            var settings = settingsManager.get(interaction.guildId);
            settings.emojisChannel = channel.id;
            settingsManager.set(interaction.guildId, settings);
        } catch (error) {
            logger.verbose("❌ No se ha podido enviar un mensaje de emojis: " + error, process.env.DEBUG === 'true');
            await interaction.editReply({ content: '`❌` No se ha podido enviar el mensaje, asegurate de que el bot tenga permisos para enviar mensajes en este canal.', ephemeral: true });
            return;
        }

        await interaction.editReply({ content: '`✅` Canal de emojis guardado correctamente.', ephemeral: true });
    }
}