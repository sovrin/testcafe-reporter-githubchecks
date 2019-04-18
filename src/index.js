const clientFactory = require('./client');
const stateFactory = require('./state');

/**
 *
 * @returns {{reportTaskDone(): Promise<void>, reportTaskStart(): Promise<void>, noColors: boolean, reportFixtureStart(*=): Promise<void>, reportTestDone(*, *): Promise<void>}}
 */
const factory = function () {
    const client = clientFactory();
    const state = stateFactory(client);

    return {
        noColors: true,

        /**
         *
         * @returns {Promise<void>}
         */
        async reportTaskStart () {
            //void
        },

        /**
         *
         * @param name
         * @returns {Promise<void>}
         */
        async reportFixtureStart (name) {
            await state.create(name);
        },

        /**
         *
         * @param name
         * @param info
         * @returns {Promise<void>}
         */
        async reportTestDone (name, info) {
            const errors = info.errs || [];
            const warnings = info.warnings || [];
            const hasErrors = !!errors.length;
            const hasWarnings = !!warnings.length;
            const result = !hasErrors ? `success` : `failed`;
            let message = '';

            errors.forEach((err, idx) => {
                message = this.formatError(err, `${idx + 1}: `) + '\n';
            });

            state.push({
                name,
                errors,
                warnings,
                hasErrors,
                hasWarnings,
                result,
                message,
            });
        },

        /**
         *
         * @returns {Promise<void>}
         */
        async reportTaskDone () {
            await state.finish();
        },
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 18.04.2019
 * Time: 09:26
 */
module.exports = factory;
