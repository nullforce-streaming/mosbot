# mosbot

A chatbot for Twitch that repeats commands.


## Prerequisites

mosbot requires:
- [Node.js](https://nodejs.org/en/) (tested with v12)

### Install Node.js

Download and install the stable release at [Node.js](https://nodejs.org/en/).


## Usage

### Install

Download and unzip the source code for this chatbot to a folder on your local disk.

From the folder execute (typically needed once):

```bash
npm install
```


### Configuration with .env

Copy `.env.sample` to `.env`. Within the `.env` file, provide values for:

Value           | Example               | Description
----------------|-----------------------|------------
MOSBOT_COMMAND  | !command              | The text of the command to send
MOSBOT_CHANNELS | channelname           | The name of the target channel (or a comma separated list of channels)
MOSBOT_USERS    | username              | The name the bot should use (or a comma separated list of usernames)
MOSBOT_TOKENS   | oauth:sometokenstring | The oauth token for the user (or a comma separated list of tokens). NOTE: each token must be preceeded by `oauth:`

The oauth token can be created at https://twitchapps.com/tmi/.

### Run

From the folder execute:

```bash
npm start
```

### Stop the Bot

Press `Ctrl+C` to stop the bot.
