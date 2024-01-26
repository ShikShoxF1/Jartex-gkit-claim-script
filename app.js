const fs = require('fs');
const mineflayer = require('mineflayer');

function readAccountsFromFile(filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const lines = content.split('\n');
    return lines
        .map(line => line.trim())
        .filter(line => line !== '')
        .map(line => {
            const [username, password] = line.split(':');
            return { username, password };
        });
}
const serverIp = 'play.jartexnetwork.com';
const serverVersion = '1.8.9';

const accounts = readAccountsFromFile('gkitalts.txt');

function loginWithAccount(account) {
    const botDetails = {
        host: serverIp,
        version: serverVersion,
        username: account.username,
    };

    const bot = mineflayer.createBot(botDetails);

    bot.on('login', () => {
        console.log(`${account.username} logged in.`);
        setTimeout(() => {
            bot.chat(`/login ${account.password}`);
        }, 2000);
        setTimeout(() => {
            bot.chat("/server Immortal");
        }, 2000);
    });

    bot.on('chat', (username, message) => {
    });

    bot.on("message", message => {
        console.log(`${account.username}: ${message}`);
    });

    process.stdin.setEncoding('utf-8');
    var stdin = process.openStdin();
    stdin.on("data", function (d) {
        let msg = d.toString().trim();
        if (msg.length === 0) return;
        bot.chat(msg);
    });
    //REPLACE YourIGN with your username 
    bot.on('chat', (username, message) => {
        if (username === 'YourIGN' && message.startsWith('.gkit')) {
            const args = message.split(' ');
            const command = args[1];

            switch (command) {
                case '-c':
                    const isSotwArg = args[2];
                    if (isSotwArg !== 'true' && isSotwArg !== 'false') {
                        bot.chat("Set sotw value to true|false");
                        return;
                    }
                    const isSotw = isSotwArg === 'true';
                    MidwayFunc(isSotw, bot);
                    break;

                case '-u':
                    //cba to make it
                    break;
                default:
                    bot.chat("Invalid arguments  (dot)gkit -c,-u true|false");
                    break;
            }
        }
    });

    async function MidwayFunc(isSotw, bot) {
        if (isSotw) {
            bot.chat("isSotw=true")
            delay(500);
            bot.chat("/clear")
            delay(500);
            bot.chat("/clear confirm")
            delay(500);
            bot.chat("Inventory Cleaned");
            delay(500);
            bot.chat("Claiming...");
            delay(500);
            claimGKit(bot);
        } else {
            bot.chat("Claiming...");
            claimGKit(bot);
        }
    }

    async function claimGKit(bot) {
        bot.chat("/gkit");
        delay(1000);

        if (bot.currentWindow == null) {
            console.log("[claimGKit] Error: No window is currently open.");
            return;
        }

        const validSlots = [];
        for (let i = 9; i <= 44; i++) {
            const item = bot.currentWindow.slots[i];
            if (item && !isExcludedItem(item) && isEnchanted(item)) {
                validSlots.push(i);
            }
        }

        if (validSlots.length === 0) {
            bot.chat("Everything is on cooldown.");
            return;
        }

        for (const slot of validSlots) {
            bot.clickWindow(slot, 0.5, 0.5);
            delay(1000);
            await GiftSystem(bot);
        }
    }

    function isExcludedItem(item) {
        return item && item.type === 160 && (item.metadata === 14 || item.metadata === 7 || item.metadata === 1);
    }

    function isEnchanted(item) {
        return item.enchants && item.enchants.length > 0;
    }
    //REPLACE YourIGN with your username
    async function GiftSystem(bot) {
        delay(1000);
        bot.chat("/gift YourIGN");
        delay(1000);

        if (bot.currentWindow == null) {
            bot.chat("Gift deposit window didnt pop up");
            return;
        } else {
            delay(1000);
            for (let i = 54; i <= 62; i++) {
                bot.clickWindow(i, 0.5, 0.5);
                delay(200);
            }

            delay(1000);
            bot.closeWindow(bot.currentWindow.id);
            delay(1000);

            if (bot.currentWindow == null) {
                bot.chat("Gift confirmation window didnt pop up");
                return;
            } else {
                delay(1000);
                bot.clickWindow(11, 0.5, 0.5);
                delay(1000);
            }
        }
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

accounts.reduce((promise, account) => {
    return promise.then(() => {
        return new Promise(resolve => {
            loginWithAccount(account);
            setTimeout(resolve, 2000);
        });
    });
}, Promise.resolve());

