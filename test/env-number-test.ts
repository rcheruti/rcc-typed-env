import * as assert from 'assert';
import { loadConfig } from '../src/env';
import { assertThrows } from './test-utils';

describe('For "number"', function () {
    const env = {
        NUMBER_INTEGER_NATIVE: 10,
        NUMBER_FLOAT_UNDERLINE_NATIVE: 10_000.35,
        NUMBER_INTEGER_NEGATIVE_NATIVE: -5,
        NUMBER_FLOAT_UNDERLINE_NEGATIVE_NATIVE: -6_000.35,
        NUMBER_INTEGER_STRING: '11',
        NUMBER_FLOAT_UNDERLINE_STRING: '11_000.35',
        NUMBER_INTEGER_NEGATIVE_STRING: '-7',
        NUMBER_FLOAT_UNDERLINE_NEGATIVE_STRING: '-8.35',
        NUMBER_ARRAY: '-8.35 ; 15_000.75 ; 88 , -16_000.40',
        NUMBER_ARRAY_NATIVE: ['-8.35', 74_000.35],
    };
    it('should load typed configs', async function () {
        let config = loadConfig({
            NUMBER_INTEGER_NATIVE: { name:'NUMBER_INTEGER_NATIVE', type:'number' },
            NUMBER_FLOAT_UNDERLINE_NATIVE: { name:'NUMBER_FLOAT_UNDERLINE_NATIVE', type:'number' },
            NUMBER_INTEGER_NEGATIVE_NATIVE: { name:'NUMBER_INTEGER_NEGATIVE_NATIVE', type:'number' },
            NUMBER_FLOAT_UNDERLINE_NEGATIVE_NATIVE: { name:'NUMBER_FLOAT_UNDERLINE_NEGATIVE_NATIVE', type:'number' },
            NUMBER_INTEGER_STRING: { name:'NUMBER_INTEGER_STRING', type:'number' },
            NUMBER_FLOAT_UNDERLINE_STRING: { name:'NUMBER_FLOAT_UNDERLINE_STRING', type:'number' },
            NUMBER_INTEGER_NEGATIVE_STRING: { name:'NUMBER_INTEGER_NEGATIVE_STRING', type:'number' },
            NUMBER_FLOAT_UNDERLINE_NEGATIVE_STRING: { name:'NUMBER_FLOAT_UNDERLINE_NEGATIVE_STRING', type:'number' },
            NUMBER_ARRAY: { name:'NUMBER_ARRAY', type:'number[]' },
            NUMBER_ARRAY_NATIVE: { name:'NUMBER_ARRAY_NATIVE', type:'number[]' },
            NUMBER_ARRAY_THAT_NOT_EXISTS: { name:'NUMBER_ARRAY_THAT_NOT_EXISTS', type:'number[]', defaultValue: [ 10, 11_000.35 ] },
            NUMBER_THAT_NOT_EXISTS: { name:'NUMBER_THAT_NOT_EXISTS', type:'number', defaultValue: 77_000.75 },
        }, env);
        assert.strictEqual( config.NUMBER_INTEGER_NATIVE, 10 );
        assert.strictEqual( typeof config.NUMBER_INTEGER_NATIVE, 'number' );
        assert.strictEqual( config.NUMBER_FLOAT_UNDERLINE_NATIVE, 10_000.35 );
        assert.strictEqual( typeof config.NUMBER_FLOAT_UNDERLINE_NATIVE, 'number' );
        assert.strictEqual( config.NUMBER_INTEGER_NEGATIVE_NATIVE, -5 );
        assert.strictEqual( typeof config.NUMBER_INTEGER_NEGATIVE_NATIVE, 'number' );
        assert.strictEqual( config.NUMBER_FLOAT_UNDERLINE_NEGATIVE_NATIVE, -6_000.35 );
        assert.strictEqual( typeof config.NUMBER_FLOAT_UNDERLINE_NEGATIVE_NATIVE, 'number' );
        assert.strictEqual( config.NUMBER_INTEGER_STRING, 11 );
        assert.strictEqual( typeof config.NUMBER_INTEGER_STRING, 'number' );
        assert.strictEqual( config.NUMBER_FLOAT_UNDERLINE_STRING, 11_000.35 );
        assert.strictEqual( typeof config.NUMBER_FLOAT_UNDERLINE_STRING, 'number' );
        assert.strictEqual( config.NUMBER_INTEGER_NEGATIVE_STRING, -7 );
        assert.strictEqual( typeof config.NUMBER_INTEGER_NEGATIVE_STRING, 'number' );
        assert.strictEqual( config.NUMBER_FLOAT_UNDERLINE_NEGATIVE_STRING, -8.35 );
        assert.strictEqual( typeof config.NUMBER_FLOAT_UNDERLINE_NEGATIVE_STRING, 'number' );
        assert.strictEqual( config?.NUMBER_ARRAY?.length, 4 );
        assert.strictEqual( config?.NUMBER_ARRAY[0], -8.35 );
        assert.strictEqual( config?.NUMBER_ARRAY[1], 15_000.75 );
        assert.strictEqual( config?.NUMBER_ARRAY[2], 88 );
        assert.strictEqual( config?.NUMBER_ARRAY[3], -16_000.40 );
        assert.strictEqual( typeof config?.NUMBER_ARRAY[0], 'number' );
        assert.strictEqual( typeof config?.NUMBER_ARRAY[1], 'number' );
        assert.strictEqual( typeof config?.NUMBER_ARRAY[2], 'number' );
        assert.strictEqual( typeof config?.NUMBER_ARRAY[3], 'number' );
        assert.strictEqual( config?.NUMBER_ARRAY_NATIVE[0], -8.35 );
        assert.strictEqual( config?.NUMBER_ARRAY_NATIVE[1], 74_000.35 );
        assert.strictEqual( typeof config?.NUMBER_ARRAY_NATIVE[0], 'number' );
        assert.strictEqual( typeof config?.NUMBER_ARRAY_NATIVE[1], 'number' );
        assert.strictEqual( config?.NUMBER_ARRAY_THAT_NOT_EXISTS[0], 10 );
        assert.strictEqual( config?.NUMBER_ARRAY_THAT_NOT_EXISTS[1], 11_000.35 );
        assert.strictEqual( typeof config?.NUMBER_ARRAY_THAT_NOT_EXISTS[0], 'number' );
        assert.strictEqual( typeof config?.NUMBER_ARRAY_THAT_NOT_EXISTS[1], 'number' );
        assert.strictEqual( config.NUMBER_THAT_NOT_EXISTS, 77_000.75 );
        assert.strictEqual( typeof config.NUMBER_THAT_NOT_EXISTS, 'number' );
    });
});

describe('For wrong "number" definitions', function () {
    const env = {
        NUMBER_STRING: 'Not a number',
        NUMBER_BOOLEAN: true,
    };
    it('should throw errors', async function () {
        assertThrows('No errors thrown parsing wrong numbers', () => {
            let config = loadConfig({
                NUMBER_STRING: { name:'NUMBER_STRING', type:'number' },
                NUMBER_BOOLEAN: { name:'NUMBER_BOOLEAN', type:'number' },
            }, env);
        });
    });
});
