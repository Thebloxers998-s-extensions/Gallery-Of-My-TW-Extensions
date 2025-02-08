(function(Scratch) {
    'use strict';

    // Define your API endpoints
    const config = {
        apiBase: 'http://localhost:4000' // Replace with your actual API base URL if different
    };

    class GameSecurity {
        getInfo() {
            return {
                id: 'gamesecurity',
                name: 'Game Security',
                blocks: [
                    {
                        opcode: 'registerGame',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Register Game [GAME] by [OWNER]',
                        arguments: {
                            GAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'MyCoolGame'
                            },
                            OWNER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Owner1'
                            }
                        }
                    },
                    {
                        opcode: 'addDevKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Add Dev Key with username [USER] and password [PASS]',
                        arguments: {
                            USER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'username'
                            },
                            PASS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'password'
                            }
                        }
                    },
                    {
                        opcode: 'enterGameWithDevKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Enter Game with Dev Key [DEV_KEY]',
                        arguments: {
                            DEV_KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'dev_key'
                            }
                        }
                    },
                    {
                        opcode: 'addLicenseKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Add License Key [LICENSE_KEY]',
                        arguments: {
                            LICENSE_KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'license_key'
                            }
                        }
                    },
                    {
                        opcode: 'fetchRegisteredGames',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'fetch registered games'
                    },
                    {
                        opcode: 'fetchGamesByOwner',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'fetch games by owner [OWNER]',
                        arguments: {
                            OWNER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Owner1'
                            }
                        }
                    }
                ]
            };
        }

        registerGame(args) {
            const { GAME, OWNER } = args;
            this.postRequest(`${config.apiBase}/register`, { gameName: GAME, owner: OWNER });
        }

        addDevKey(args) {
            const { USER, PASS } = args;
            this.postRequest(`${config.apiBase}/add-dev-key`, { username: USER, password: PASS });
        }

        enterGameWithDevKey(args) {
            const devKey = args.DEV_KEY;
            this.getRequest(`${config.apiBase}/enter-game/${devKey}`, { 'Authorization': `Bearer ${devKey}` });
        }

        addLicenseKey(args) {
            const licenseKey = args.LICENSE_KEY;
            this.postRequest(`${config.apiBase}/add-license-key`, { licenseKey });
        }

        async fetchRegisteredGames() {
            try {
                const response = await fetch(`${config.apiBase}/export-all-games`);
                const games = await response.json();
                return JSON.stringify(games);
            } catch (error) {
                console.error('Error fetching games:', error);
                return 'Error fetching games';
            }
        }

        async fetchGamesByOwner(args) {
            const { OWNER } = args;
            try {
                const response = await fetch(`${config.apiBase}/games-by-owner/${OWNER}`);
                const games = await response.json();
                return JSON.stringify(games.games);
            } catch (error) {
                console.error('Error fetching games by owner:', error);
                return 'Error fetching games by owner';
            }
        }

        postRequest(url, body) {
            Scratch.fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(data => console.log('Response:', data))
            .catch(error => console.error('Error:', error));
        }

        getRequest(url, headers) {
            Scratch.fetch(url, {
                method: 'GET',
                headers: headers
            })
            .then(response => response.json())
            .then(data => console.log('Response:', data))
            .catch(error => console.error('Error:', error));
        }
    }

    Scratch.extensions.register(new GameSecurity());
})(Scratch);
