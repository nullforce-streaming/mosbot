import * as tmi from "tmi.js";
import * as dotenv from "dotenv";
import client from "tmi.js/lib/client";
import { exit } from "process";

class MosBot {
    username: string;
    token: string;
    client: client;

    dict = {};
    lastCommandCountTime: any;
    commandCount = {};

    constructor(username: string, token: string) {
        this.username = username;
        this.token = token;

        const opts = {
            identity: {
                username: username,
                password: token,
            },
            channels: channels
        }

        const client = tmi.client(opts);
        this.client = client;

        client.on("message", (channel, context, msg, self) => this.onMessageHandler(channel, context, msg, self));
        client.on("connected", (any, port) => this.onConnectedHandler(any, port));

        client.connect();
    }

    onConnectedHandler(addr, port) {
        console.log(`* ${this.username} connected to ${addr}:${port}`);
    }

    onMessageHandler(channel, context, msg, self) {
        if (self) return;

        const d = new Date();
        const now = d.getTime();

        const commandName = msg.trim();
        const commandNameLower = commandName.toLowerCase();
        const username = context.username.toLowerCase();

        if (this.username === firstUsername) {
            console.log(`Channel: ${channel}, Username: '${username}', Command: '${commandName}'`);
        }

        let executeCommand = false;

        if (commandName.startsWith(command)) {
            let commandReceivedCount = this.commandCount[channel] || 0;

            if (secondsAgo(this.lastCommandCountTime, now, 30)) {
                commandReceivedCount = 0;
            }

            this.commandCount[channel] = ++commandReceivedCount;
            this.lastCommandCountTime = now;

            if (this.username === firstUsername) {
                console.log(`Command count[${channel}]: ${commandReceivedCount}`);
            }

            if (commandReceivedCount >= 2) {
                executeCommand = true;
            }
        }

        if (executeCommand) {
            const last = this.dict[channel];

            // reset play count
            this.commandCount[channel] = 0;

            if (typeof last === "undefined" || secondsAgo(last, now, 120)) {
                this.dict[channel] = now;
                setTimeout(() => {
                    this.client.say(channel, command);
                    console.log(`Time: ${now}, [${this.username}] Sending ${command}`);
                }, getRandomInt(6) * 1000);
            }
        }
    }
}

dotenv.config();

if (process.env.MOSBOT_COMMAND === undefined || process.env.MOSBOT_CHANNELS === undefined || process.env.MOSBOT_USERS === undefined || process.env.MOSBOT_TOKENS === undefined) {
    console.log("Command, Channels, Users, and Tokens must be provided!");
    process.exit();
}

const command: string = process.env.MOSBOT_COMMAND;
const channels: string[] = process.env.MOSBOT_CHANNELS.split(',');
const usernames: string[] = process.env.MOSBOT_USERS.split(',');
const tokens: string[] = process.env.MOSBOT_TOKENS.split(',');
const firstUsername = usernames[0];

console.log(usernames);

// spawn one client per user
for (let i in usernames) {
    const bot = new MosBot(usernames[i], tokens[i]);
}

function secondsAgo(last, now, seconds) {
    if (typeof last === "undefined") {
        return true;
    }

    const diff = (now - last) / 1000;
    return diff >= seconds;
}

function getRandomInt(max): number {
    return Math.floor(Math.random() * Math.floor(max));
}
