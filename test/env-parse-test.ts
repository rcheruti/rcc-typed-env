import * as assert from 'assert';
import { parseAuto, parseBoolean, parseNumber } from '../src/env';
import { assertThrows } from './test-utils';

describe('The "parse..." functions', function () {
    // parseBoolean
    it('should "parseBoolean" return a boolean value', async function () {
        assert.strictEqual( parseBoolean(true), true );
        assert.strictEqual( parseBoolean(false), false );
        assert.strictEqual( parseBoolean('true'), true );
        assert.strictEqual( parseBoolean('false'), false );
        assert.strictEqual( parseBoolean('TrUe'), true );
        assert.strictEqual( parseBoolean('FaLSe'), false );
        assert.strictEqual( parseBoolean('  TrUe    '), true );
        assert.strictEqual( parseBoolean('    FaLSe '), false );
    });
    it('should "parseBoolean" return a default value on parse error', async function () {
        assert.strictEqual( parseBoolean( '10_000', true ), true );
        assert.strictEqual( parseBoolean( '10_000', false ), false );
        assert.strictEqual( parseBoolean( 'another string', true ), true );
        assert.strictEqual( parseBoolean( 'another string', false ), false );
        assert.strictEqual( parseBoolean( [], true ), true );
        assert.strictEqual( parseBoolean( {}, true ), true );
        assert.strictEqual( parseBoolean( function(){}, true ), true );
    });
    it('should "parseBoolean" throws an error', async function () {
        await assertThrows('Void string', () => parseBoolean(''));
        await assertThrows('Another string', () => parseBoolean('another string'));
        await assertThrows('Another number', () => parseBoolean(10_000.35));
        await assertThrows('Another array', () => parseBoolean([]));
        await assertThrows('Another object', () => parseBoolean({}));
        await assertThrows('Another function', () => parseBoolean( function(){} ));
    });

    // parseNumber
    it('should "parseNumber" return a boolean value', async function () {
        assert.strictEqual( parseNumber( 10_000.35 ), 10_000.35 );
        assert.strictEqual( parseNumber( '10_000.35' ), 10_000.35 );
        assert.strictEqual( parseNumber( '  10_000.35  ' ), 10_000.35 );
    });
    it('should "parseNumber" return a default value on parse error', async function () {
        assert.strictEqual( parseNumber( 'false', 11_000.35 ), 11_000.35 );
        assert.strictEqual( parseNumber( 'true', 11_000.35 ), 11_000.35 );
        assert.strictEqual( parseNumber( 'another string', 11_000.35 ), 11_000.35 );
        assert.strictEqual( parseNumber( [], 11_000.35 ), 11_000.35 );
        assert.strictEqual( parseNumber( {}, 11_000.35 ), 11_000.35 );
        assert.strictEqual( parseNumber( function(){}, 11_000.35 ), 11_000.35 );
    });
    it('should "parseNumber" throws an error', async function () {
        await assertThrows('Void string', () => parseNumber(''));
        await assertThrows('Another string', () => parseNumber('another string'));
        await assertThrows('Another boolean', () => parseNumber(true));
        await assertThrows('Another array', () => parseNumber([]));
        await assertThrows('Another object', () => parseNumber({}));
        await assertThrows('Another function', () => parseNumber( function(){} ));
    });

    // parseAuto
    it('should "parseAuto" return a boolean value', async function () {
        assert.strictEqual( parseAuto( ' true ' ), true );
        assert.strictEqual( parseAuto( ' FalSE ' ), false );
        assert.strictEqual( parseAuto( true ), true );
        assert.strictEqual( parseAuto( false ), false );
        assert.strictEqual( parseAuto( '10_000.35' ), 10_000.35 );
        assert.strictEqual( parseAuto( 10_000.35 ), 10_000.35 );
        assert.strictEqual( parseAuto( 'another value' ), 'another value' );
        
        assert.strictEqual( parseAuto( '0', 'default value' ), 0 );
        assert.strictEqual( parseAuto( ' FalSE ', 'default value' ), false );
        assert.strictEqual( parseAuto( '', 'default value' ), 'default value' );
        assert.strictEqual( parseAuto( '   ', 'default value' ), 'default value' );
    });
});