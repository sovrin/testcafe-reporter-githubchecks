const {readFileSync: read} = require('fs');
const {resolve} = require('path');
const app = require('github-app');

/**
 *
 * @returns {{create: (function(*, *=, *): *), update: (function(*=, *, *, *, *): *)}}
 */
const factory = () => {
    const key =  process.env.GITHUB_PRIVATE_KEY_PATH;
    const appId = process.env.GITHUB_APP_ID;
    const instId = process.env.GITHUB_INST_ID;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPOSITORY;
    const sha = process.env.GITHUB_COMMIT_SHA;

    const path = resolve(key);
    const cert = read(path);
    const {asInstallation} = app({id: appId, cert});

    /**
     *
     * @param name
     * @param status
     * @returns {Promise<*>}
     */
    const create = async (name, status) =>
        await asInstallation(instId).then(github =>
            github.checks.create({
                owner,
                repo,
                name,
                status,
                started_at: (new Date()).toISOString(),
                head_sha: sha,
            }),
        )
    ;

    /**
     *
     * @param id
     * @param name
     * @param status
     * @param conclusion
     * @param output
     * @returns {Promise<*>}
     */
    const update = async (id, name, status, conclusion, output) =>
        await asInstallation(instId).then(github =>
            github.checks.update({
                owner,
                repo,
                check_run_id: id,
                name,
                status,
                conclusion,
                completed_at: (new Date()).toISOString(),
                head_sha: sha,
                output,
            }),
        )
    ;

    return {
        create,
        update,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 18.04.2019
 * Time: 11:02
 */
module.exports = factory;
