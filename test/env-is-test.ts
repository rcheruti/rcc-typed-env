import * as assert from 'assert';
import { isBoolean, isNumber, isString } from '../src/env';

describe('The "is..." functions', function () {
    it('should "isBoolean" check a boolean value', async function () {
        assert.strictEqual( isBoolean('true'), true );
        assert.strictEqual( isBoolean('TRUE'), true );
        assert.strictEqual( isBoolean('false'), true );
        assert.strictEqual( isBoolean('FALSE'), true );
        assert.strictEqual( isBoolean('TruE'), true );
        assert.strictEqual( isBoolean('FalSe'), true );
        assert.strictEqual( isBoolean(false), true );
        assert.strictEqual( isBoolean(true), true );
        
        assert.strictEqual( isBoolean( 10 ), false );
        assert.strictEqual( isBoolean( 10.35 ), false );
        assert.strictEqual( isBoolean( 0xFF ), false );
        assert.strictEqual( isBoolean( null ), false );
        assert.strictEqual( isBoolean( {} ), false );
        assert.strictEqual( isBoolean( function(){} ), false );
        assert.strictEqual( isBoolean( [] ), false );
        assert.strictEqual( isBoolean( '' ), false );
        assert.strictEqual( isBoolean( 'another value' ), false );
        assert.strictEqual( isBoolean( undefined ), false );
    });
    it('should "isNumber" check a number value', async function() {
        assert.strictEqual( isNumber( 0 ), true );
        assert.strictEqual( isNumber( 11 ), true );
        assert.strictEqual( isNumber( 11_000 ), true );
        assert.strictEqual( isNumber( 11.35 ), true );
        assert.strictEqual( isNumber( 0x88 ), true );
        assert.strictEqual( isNumber( 0o77 ), true );
        assert.strictEqual( isNumber( 0b11 ), true );
        assert.strictEqual( isNumber( '0x88' ), true );
        assert.strictEqual( isNumber( '10' ), true );
        assert.strictEqual( isNumber( '10.35' ), true );
        assert.strictEqual( isNumber( '10_000.75' ), true );

        // !! not supported at moment !!
        assert.strictEqual( isNumber( '0o77' ), false );
        assert.strictEqual( isNumber( '0b11' ), false );
        
        assert.strictEqual( isNumber( false ), false );
        assert.strictEqual( isNumber( true ), false );
        assert.strictEqual( isNumber( null ), false );
        assert.strictEqual( isNumber( {} ), false );
        assert.strictEqual( isNumber( function(){} ), false );
        assert.strictEqual( isNumber( [] ), false );
        assert.strictEqual( isNumber( '' ), false );
        assert.strictEqual( isNumber( 'another value' ), false );
        assert.strictEqual( isNumber( undefined ), false );
    });
    it('should "isString" check a string value', async function() {
        assert.strictEqual( isString( '' ), true );
        assert.strictEqual( isString( 'a string value' ), true );
        assert.strictEqual( isString( '10' ), true );
        assert.strictEqual( isString( '10_000.35' ), true );
        assert.strictEqual( isString( 'true' ), true );
        assert.strictEqual( isString( 'false' ), true );
        assert.strictEqual( isString( 'http://localhost:9999/path' ), true );
        
        assert.strictEqual( isString( 10 ), false );
        assert.strictEqual( isString( 10.35 ), false );
        assert.strictEqual( isString( 0xFF ), false );
        assert.strictEqual( isString( false ), false );
        assert.strictEqual( isString( true ), false );
        assert.strictEqual( isString( null ), false );
        assert.strictEqual( isString( {} ), false );
        assert.strictEqual( isString( function(){} ), false );
        assert.strictEqual( isString( [] ), false );
        assert.strictEqual( isString( undefined ), false );
    });
});