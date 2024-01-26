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


         //replace YourIGN with your IGN
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
            await new Promise(resolve => setTimeout(resolve, 500))
            bot.chat("/clear")
            await new Promise(resolve => setTimeout(resolve, 500))
            bot.chat("/clear confirm")
            await new Promise(resolve => setTimeout(resolve, 500))
            bot.chat("Inventory Cleaned");
            await new Promise(resolve => setTimeout(resolve, 500))
            bot.chat("Claiming...");
            await new Promise(resolve => setTimeout(resolve, 500))
            claimGKit(bot);
        } else {
            bot.chat("Claiming...");
            claimGKit(bot);
        }
    }

    async function claimGKit(bot) {
        bot.chat("/gkit");
        await new Promise(resolve => setTimeout(resolve, 1000));

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
            bot.chat("Everything's on cooldown.");
            return;
        }

        for (const slot of validSlots) {
            bot.clickWindow(slot, 0.5, 0.5);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await GiftSystem(bot);
        }
    }

    function isExcludedItem(item) {
        return item && item.type === 160 && (item.metadata === 14 || item.metadata === 7 || item.metadata === 1);
    }

    function isEnchanted(item) {
        return item.enchants && item.enchants.length > 0;
    }

    async function GiftSystem(bot) {
        await new Promise(resolve => setTimeout(resolve, 1000));
       //replace YourIGN with your IGN or the gift receiver IGN
        bot.chat("/gift YourIGN");
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (bot.currentWindow == null) {
            bot.chat("Gift deposit window didnt pop up");
            return;
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
            for (let i = 54; i <= 62; i++) {
                bot.clickWindow(i, 0.5, 0.5);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            bot.closeWindow(bot.currentWindow.id);
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (bot.currentWindow == null) {
                bot.chat("Gift confirmation window didnt pop up");
                return;
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
                bot.clickWindow(11, 0.5, 0.5);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
}
accounts.reduce((promise, account) => {
    return promise.then(() => {
        return new Promise(resolve => {
            loginWithAccount(account);
            setTimeout(resolve, 2500);
        });
    });
}, Promise.resolve());
