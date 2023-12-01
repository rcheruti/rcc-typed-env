import * as assert from 'assert';
import { loadConfig } from '../src/env';

describe('From object', function () {
    const env = {
        SERVICE_URL: 'http://localhost:9999',
        RETRY_LIMIT: '8',
        FEATURE_ENABLED: 'true',
    };
    it('shoud load typed configs', async function () {
        let config = loadConfig({
            serviceURL: { name:'SERVICE_URL', type:'string', defaultValue:'none' },
            retryLimit: { name:'RETRY_LIMIT', type:'number', defaultValue: 0 },
            featureEnabled: { name:'FEATURE_ENABLED', type:'boolean', defaultValue: false },
        }, env);
        assert.strictEqual( config.serviceURL, env.SERVICE_URL );
        assert.strictEqual( typeof config.serviceURL, 'string' );
        assert.strictEqual( config.retryLimit, 8 );
        assert.strictEqual( typeof config.retryLimit, 'number' );
        assert.strictEqual( config.featureEnabled, true );
        assert.strictEqual( typeof config.featureEnabled, 'boolean' );
    });
});
describe('From "process.env"', function () {
    process.env.SERVICE_URL = "http://localhost:9999";
    process.env.RETRY_LIMIT = "8";
    process.env.FEATURE_ENABLED = "true";
    it('shoud load typed configs', async function () {
        let config = loadConfig({
            serviceURL: { name:'SERVICE_URL', type:'string', defaultValue:'none' },
            retryLimit: { name:'RETRY_LIMIT', type:'number', defaultValue: 0 },
            featureEnabled: { name:'FEATURE_ENABLED', type:'boolean', defaultValue: false },
        }); // no env object in the parameters
        assert.strictEqual( config.serviceURL, process.env.SERVICE_URL );
        assert.strictEqual( typeof config.serviceURL, 'string' );
        assert.strictEqual( config.retryLimit, 8 );
        assert.strictEqual( typeof config.retryLimit, 'number' );
        assert.strictEqual( config.featureEnabled, true );
        assert.strictEqual( typeof config.featureEnabled, 'boolean' );
    });
});
describe('From a list of inputs environments', function () {
    const env1 = {
        SERVICE_URL: 'http://localhost:9999',
        RETRY_LIMIT: '8',
        FEATURE_ENABLED: 'true',
    };
    const env2 = {
        SERVICE_URL: 'http://www.another.com',
        FEATURE_ENABLED: 'false',
    };
    it('shoud load typed configs', async function () {
        let config = loadConfig({
            serviceURL: { name:'SERVICE_URL', type:'string', defaultValue:'none' },
            retryLimit: { name:'RETRY_LIMIT', type:'number', defaultValue: 0 },
            featureEnabled: { name:'FEATURE_ENABLED', type:'boolean', defaultValue: false },
        }, [ env1, env2 ]); // no env object in the parameters
        assert.strictEqual( config.serviceURL, env2.SERVICE_URL );
        assert.strictEqual( typeof config.serviceURL, 'string' );
        assert.strictEqual( config.retryLimit, 8 );
        assert.strictEqual( typeof config.retryLimit, 'number' );
        assert.strictEqual( config.featureEnabled, false );
        assert.strictEqual( typeof config.featureEnabled, 'boolean' );
    });
});
describe('With the same output object', function () {
    const env1 = {
        SERVICE_URL: 'http://localhost:9999',
        RETRY_LIMIT: '8',
        FEATURE_ENABLED: 'true',
    };
    const env2 = {
        SERVICE_URL: 'http://www.another.com',
        FEATURE_ENABLED: 'false',
    };
    it('shoud override old configs', async function () {
        let config = loadConfig({
            serviceURL: { name:'SERVICE_URL', type:'string', defaultValue:'none' },
            retryLimit: { name:'RETRY_LIMIT', type:'number', defaultValue: 0 },
            featureEnabled: { name:'FEATURE_ENABLED', type:'boolean', defaultValue: false },
        }, env1, {}); // no env object in the parameters
        assert.strictEqual( config.serviceURL, env1.SERVICE_URL );
        assert.strictEqual( typeof config.serviceURL, 'string' );
        assert.strictEqual( config.retryLimit, 8 );
        assert.strictEqual( typeof config.retryLimit, 'number' );
        assert.strictEqual( config.featureEnabled, true );
        assert.strictEqual( typeof config.featureEnabled, 'boolean' );
        
        config = loadConfig({
            serviceURL: { name:'SERVICE_URL', type:'string', defaultValue:'none' },
            retryLimit: { name:'RETRY_LIMIT', type:'number', defaultValue: 0 },
            featureEnabled: { name:'FEATURE_ENABLED', type:'boolean', defaultValue: false },
        }, env2, config); // no env object in the parameters
        assert.strictEqual( config.serviceURL, env2.SERVICE_URL );
        assert.strictEqual( typeof config.serviceURL, 'string' );
        assert.strictEqual( config.retryLimit, 8 );
        assert.strictEqual( typeof config.retryLimit, 'number' );
        assert.strictEqual( config.featureEnabled, false );
        assert.strictEqual( typeof config.featureEnabled, 'boolean' );
    });
});
