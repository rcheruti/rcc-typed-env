import * as assert from 'assert';
import { loadConfig } from '../src/env';

describe('For "boolean"', function () {
    const env = {
        BOOLEAN_LOWERCASE_FALSE: 'false',
        BOOLEAN_UPPERCASE_FALSE: 'FALSE',
        BOOLEAN_MIXEDCASE_FALSE: 'FaLsE',
        BOOLEAN_LOWERCASE_TRUE: 'true',
        BOOLEAN_UPPERCASE_TRUE: 'TRUE',
        BOOLEAN_MIXEDCASE_TRUE: 'TrUe',
        BOOLEAN_ARRAY: 'TrUe False true FALSE',
        BOOLEAN_ALREADY_TRUE: true,
    };
    it('shoud load typed configs', async function () {
        let config = loadConfig({
            BOOLEAN_LOWERCASE_FALSE: { name:'BOOLEAN_LOWERCASE_FALSE', type:'boolean' },
            BOOLEAN_UPPERCASE_FALSE: { name:'BOOLEAN_UPPERCASE_FALSE', type:'boolean' },
            BOOLEAN_MIXEDCASE_FALSE: { name:'BOOLEAN_MIXEDCASE_FALSE', type:'boolean' },
            BOOLEAN_LOWERCASE_TRUE: { name:'BOOLEAN_LOWERCASE_TRUE', type:'boolean' },
            BOOLEAN_UPPERCASE_TRUE: { name:'BOOLEAN_UPPERCASE_TRUE', type:'boolean' },
            BOOLEAN_MIXEDCASE_TRUE: { name:'BOOLEAN_MIXEDCASE_TRUE', type:'boolean' },
            BOOLEAN_ARRAY: { name:'BOOLEAN_ARRAY', type:'boolean', isArray: true, separator:/\s+/g },
            BOOLEAN_ALREADY_TRUE: { name:'BOOLEAN_ALREADY_TRUE', type:'boolean' },
            BOOLEAN_THAT_NOT_EXISTS: { name:'BOOLEAN_THAT_NOT_EXISTS', type:'boolean', defaultValue: true },
        }, env);
        assert.strictEqual( config.BOOLEAN_LOWERCASE_FALSE, false );
        assert.strictEqual( typeof config.BOOLEAN_LOWERCASE_FALSE, 'boolean' );
        assert.strictEqual( config.BOOLEAN_UPPERCASE_FALSE, false );
        assert.strictEqual( typeof config.BOOLEAN_UPPERCASE_FALSE, 'boolean' );
        assert.strictEqual( config.BOOLEAN_MIXEDCASE_FALSE, false );
        assert.strictEqual( typeof config.BOOLEAN_MIXEDCASE_FALSE, 'boolean' );
        assert.strictEqual( config.BOOLEAN_LOWERCASE_TRUE, true );
        assert.strictEqual( typeof config.BOOLEAN_LOWERCASE_TRUE, 'boolean' );
        assert.strictEqual( config.BOOLEAN_UPPERCASE_TRUE, true );
        assert.strictEqual( typeof config.BOOLEAN_UPPERCASE_TRUE, 'boolean' );
        assert.strictEqual( config.BOOLEAN_MIXEDCASE_TRUE, true );
        assert.strictEqual( typeof config.BOOLEAN_MIXEDCASE_TRUE, 'boolean' );
        assert.strictEqual( config?.BOOLEAN_ARRAY?.length, 4 );
        assert.strictEqual( config?.BOOLEAN_ARRAY[0], true );
        assert.strictEqual( config?.BOOLEAN_ARRAY[1], false );
        assert.strictEqual( config?.BOOLEAN_ARRAY[2], true );
        assert.strictEqual( config?.BOOLEAN_ARRAY[3], false );
        assert.strictEqual( typeof config?.BOOLEAN_ARRAY[0], 'boolean' );
        assert.strictEqual( typeof config?.BOOLEAN_ARRAY[1], 'boolean' );
        assert.strictEqual( typeof config?.BOOLEAN_ARRAY[2], 'boolean' );
        assert.strictEqual( typeof config?.BOOLEAN_ARRAY[3], 'boolean' );
        assert.strictEqual( config.BOOLEAN_THAT_NOT_EXISTS, true );
        assert.strictEqual( typeof config.BOOLEAN_THAT_NOT_EXISTS, 'boolean' );
    });
});

describe('For wrong "boolean" definitions', function () {
    const env = {
        BOOLEAN_STRING: 'Not a boolean',
        BOOLEAN_NUMBER: 89,
    };
    it('should throw errors', async function () {
        let config = loadConfig({
            BOOLEAN_STRING: { name:'BOOLEAN_STRING', type:'boolean' },
            BOOLEAN_NUMBER: { name:'BOOLEAN_NUMBER', type:'boolean' },
        }, env);

    });
});
