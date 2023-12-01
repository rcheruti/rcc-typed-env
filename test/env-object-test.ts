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
