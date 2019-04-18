/**
 *
 * @param client
 */
const factory = (client) => {
    const state = {};

    /**
     *
     * @param name
     * @returns {Promise<void>}
     */
    const create = async (name) => {
        const {data: {id}} = await client.create(name, 'in_progress');

        state[id] = {
            name,
            result: [],
        };
    };

    /**
     *
     * @returns {Promise<void>}
     */
    const finish = async () => {
        const ids = Object.keys(state);

        while (ids.length) {
            const id = ids.shift();
            const {result, name} = state[id];
            const passed = result.every(({hasErrors}) => !hasErrors);
            const conclusion = (passed) ? 'success' : 'failure';
            const summaries = result.map(({name, message}) => name + ': ' + message);

            const output = {
                title: 'Output',
                summary: summaries.join('\n'),
            };

            await client.update(id, name, 'completed', conclusion, output);
        }
    };

    /**
     *
     * @param result
     */
    const push = (result) => {
        const id = Object.keys(state).slice(-1)[0];
        state[id].result.push(result);
    };

    return {
        create,
        push,
        finish,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 18.04.2019
 * Time: 09:24
 */
module.exports = factory;
