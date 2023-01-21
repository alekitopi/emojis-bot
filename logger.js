const colors = require('colors');

module.exports = {
    info: function (text) {
        const PREFIX = "✅ " + colors.bgBlue(" INFO  ")
        console.log(`${colors.bold(colors.white(PREFIX))} ${text}`);
    },
    error: function (text) {
        const PREFIX = "❌ " + colors.bgRed(" ERROR ")
        console.log(`${colors.bold(colors.white(PREFIX))} ${text}`);
    },
    debug: function (text) {
        const PREFIX = "🐛 " + colors.bgGray(" DEBUG ")
        console.log(`${colors.bold(colors.white(PREFIX))} ${text}`);
    },
    verbose: function (text, verbose) {
        if (verbose) {
            const PREFIX = "📢 " + colors.bgCyan(" VRBSE ")
            console.log(`${colors.bold(colors.white(PREFIX))} ${text}`);
        }
    }
}