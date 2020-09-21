import * as dotenv from "dotenv";
import { MosBot, MosBotOptions } from "./mosbot";

const config = require("./config.json")

dotenv.config();

if (process.env.MOSBOT_COMMAND === undefined || process.env.MOSBOT_CHANNELS === undefined || process.env.MOSBOT_USERS === undefined || process.env.MOSBOT_TOKENS === undefined) {
    console.log("Command, Channels, Users, and Tokens must be provided!");
    process.exit();
}

const command: string = process.env.MOSBOT_COMMAND.trim();
const commandWindowInSeconds: number = parseInt(process.env.MOSBOT_COMMAND_WINDOW_SECONDS) ?? 30;
const commandCooldownInSeconds: number = parseInt(process.env.MOSBOT_COMMAND_COOLDOWN_SECONDS) ?? 120;

const channels: string[] = trimAndSplit(process.env.MOSBOT_CHANNELS);
const usernames: string[] = trimAndSplit(process.env.MOSBOT_USERS);
const tokens: string[] = trimAndSplit(process.env.MOSBOT_TOKENS);
const firstUsername = usernames[0];

console.log(`Usernames ${usernames}`);
console.log(`Channels ${channels}`);

const mosBotOptions: MosBotOptions = {
    channels: channels,
    command: command,
    primaryUser: firstUsername,
    commandWindowInSeconds: commandWindowInSeconds,
    commandCooldownInSeconds: commandCooldownInSeconds,
    responseConfig: config.responseConfig,
};

// spawn one client per user
for (let i in usernames) {
    const bot = new MosBot(usernames[i], tokens[i], mosBotOptions);
}

function trimAndSplit(str: string): string[] {
    return str.replace(/ /g, '').split(',');
}
