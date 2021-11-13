const { ipcMain } = require('electron');
const Git = require('nodegit');

module.exports = class GitManager {

    constructor() {
        this.repo = null;
    }

    async gitOpen(filePath) {
        let self = this;
        await Git.Repository.open(filePath).then(function (repo) {
            self.repo = repo;
        });
    }

    async gitLog() {
        let self = this;
        if (self.repo !== null) {
            let branches = {};
            await self.repo.getReferences().then(async function (stdVectorGitReference) {
                let gitReferences = {};
                for (let ref of stdVectorGitReference) {
                    if (!(ref.toString() in gitReferences)) {
                        gitReferences[ref.toString()] = ref;
                    }
                }
                let values = Object.keys(gitReferences).map(function(key){
                    return gitReferences[key];
                });
                for (let ref of values) {
                    let commitId = await self.repo.getBranchCommit(ref).then(function (commit) {
                        return commit.id().toString();
                    });
                    if (ref.isHead()) {
                        if (commitId in branches) {
                            branches[commitId].push('* ' + ref.toString());
                        }
                        else {
                            branches[commitId] = ['* ' + ref.toString()];
                        }
                    } else {
                        if (commitId in branches) {
                            branches[commitId].push(ref.toString());
                        }
                        else {
                            branches[commitId] = [ref.toString()];
                        }
                    }
                }
            });
            return await self.repo.getHeadCommit().then(async function (headCommit) {
                let history = headCommit.history();

                let results = [];
                await new Promise(function (resolve, reject) {
                    history.on('end', function (commits) {
                        for (let commit of commits) {
                            if (commit.id().toString() in branches) {
                                results.push([branches[commit.id().toString()], commit.message()]);
                            } else {
                                results.push([[], commit.message()]);
                            }
                        }
                        resolve();
                    });

                    history.start();
                });

                return results;
            });
        }
    }

    gitFetch(win) {
        let self = this;
        self.repo.fetchAll({
            downloadTags: true,
            callbacks: {
                credentials: async function () {
                    return await self.getCred(win);
                }
            }
        }).then(function() {
            console.log('Fetch Success!');
        });
    }

    async getCred(win) {
        let username = '';
        let password = '';

        await new Promise(function (resolve, reject) {
            win.webContents.send('git-fetch-creds', []);
            ipcMain.on('git-fetch-creds', (event, arg) => {
                username = arg[0];
                password = arg[1];
                resolve();
            });
        });

        return Git.Cred.userpassPlaintextNew(username, password);
    }
}
