const fs = require('fs');

module.exports = {
    get: (guildId) => {
        var settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
        return settings[guildId] || {};
    },
    set: (guildId, settings) => {
        var settingsFile = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
        settingsFile[guildId] = settings;
        fs.writeFileSync('./settings.json', JSON.stringify(settingsFile, null, 4), 'utf8');
    }
}