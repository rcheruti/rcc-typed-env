

export declare type EnvConfigScalarTypes = 'auto' | 'boolean' | 'number' | 'string' ;
export declare type EnvConfigArrayTypes = 'auto[]' | 'boolean[]' | 'number[]' | 'string[]' ;
export declare type EnvConfigTypeField = EnvConfigScalarTypes | EnvConfigArrayTypes ;
export declare type EnvConfigValueField = boolean | number | string ;

/** Configurations to load environment variables */
export interface EnvConfig {
    /**
     * The name of the variable.  
     * This is the name that will be searched for values loading.
     * @required
     */
    name: string ;
    /** 
     * The type of the variable. Each type has a default value when no one is founded:  
     * - **auto**: will try different parse strategies, and set to `null` by default.  
     * - **boolean**: will try parse boolean (words `false` or `true`), and set to `false` by default. The reading of boolean words is Case-Insensitive.  
     * - **number**: will parse as number (using `parseFloat(...)`), and set to `0.0` by default.  
     * - **string**: will load as string (*'as is'*), and set to empty string (`""`) by default. Case is not changed.  
     * - **any array type**: will parse following the abode rules of the Scalar types, and set to empty array (`[]`) by default.
     * 
     * @default auto
     */
    type?: EnvConfigTypeField;
    /**
     * Separator to use when `type` is an Array Type, one of {@link EnvConfigArrayTypes} types.  
     * *In case of `RegExp` remember to use the `g` modifier. E.g.: `/[\|,;]/g` or `/[\s]/g`*  
     * 
     * @default RegEx /\s*[,;]+\s* /g
     */
    separator?: string | RegExp ;
    /** 
     * Default value to set if no one is founded.  
     * See field `type` to check default values for each type.
     */
    defaultValue?: EnvConfigValueField | EnvConfigValueField[] ;
};
export interface EnvDefinition { [key: string]: EnvConfig };

// ------------------------------------------------

/**
 * This is an auxiliary function to help writing configurations with code complection.  
 * With this method, IDEs will know if some information in yours configuration is wrong,
 * and can help on how to fix.
 * 
 * @param config Type {@link EnvDefinition}, configuration of what to load, and how, from Environment Variables.
 * @returns The same configuration `config`
 */
export function defineConfig<T extends EnvDefinition>(config: T): T {
    return config;
}
export function defineConfigType<T extends EnvDefinition, 
    R = {
        [P in keyof T]: 
          T[P]['type'] extends 'string' ? string
        : T[P]['type'] extends 'number' ? number
        : T[P]['type'] extends 'boolean' ? boolean
        : T[P]['type'] extends 'auto' ? any
        : T[P]['type'] extends 'string[]' ? string[]
        : T[P]['type'] extends 'number[]' ? number[]
        : T[P]['type'] extends 'boolean[]' ? boolean[]
        : T[P]['type'] extends 'auto[]' ? any[]
        : undefined
    }
>(config: T): R {
    return {} as R;
}

/**
 * Load configurations from environment variables.  
 * E.g.:  
 * ```js
 * {
 *      databaseURL: { name: 'DATABASE_URL' },
 *      connectionPool: { name: 'DATABASE_CONNECTION_POOL', type: 'number', defaultValue: 10 },
 * }
 * ```
 * The above structure is of the {@link EnvDefinition} type, and mit the following pattern:  
 * ```js
 * {
 *      ['the name of the field in the loaded configution']: [EnvConfig]
 * }
 * ```
 * 
 * Use it to define the global configuration object:  
 * `export const Config = loadConfig( { ... } as EnvDefinition );`
 * 
 * This function will return a Typed configuration object if you use Typescript.
 * 
 * @param config Type {@link EnvDefinition}, configuration of what to load, and how, from Environment Variables.
 * @param envObj Environment variables, defaults to `process?.env || {}`. Can be a list of objects to load from.
 * @param mergeConfig Object to put values on. Old values in this object will be override.
 * @returns Loaded configuration from environment variables. If `mergeConfig` is set, then that object will be returned with values updated.
 */
export function loadConfig<T extends EnvDefinition, 
    R = {
        [P in keyof T]: 
          T[P]['type'] extends 'string' ? string
        : T[P]['type'] extends 'number' ? number
        : T[P]['type'] extends 'boolean' ? boolean
        : T[P]['type'] extends 'auto' ? any
        : T[P]['type'] extends 'string[]' ? string[]
        : T[P]['type'] extends 'number[]' ? number[]
        : T[P]['type'] extends 'boolean[]' ? boolean[]
        : T[P]['type'] extends 'auto[]' ? any[]
        : undefined
    }
>
(config: T, envObjArr: Record<string, any>[] | Record<string, any> = process?.env || {}, mergeConfig: any = {}): R {
    if( !Array.isArray( envObjArr ) ) envObjArr = [ envObjArr ]; // always array after that
    let thatConfig: any = mergeConfig || {};
    let errors: { key: string, envName: string, envIdx: number, ex: Error }[] = [];
    for(let key in config) {
        let cfg = config[ key ];
        for(let envIdx = 0 ; envIdx < ( envObjArr as Record<string, any>[] ).length ; envIdx++) {
            let envObj = envObjArr[ envIdx ];
            if( !(cfg.name in envObj) && (key in thatConfig) ) continue;
            try {
                thatConfig[ key ] = parseConfig( cfg, envObj );
            } catch(ex: any) { // save error
                errors.push({
                    key: key,
                    envName: cfg.name,
                    envIdx: envIdx as number,
                    ex: ex,
                });
            }
        }
    }
    // check errors and thorw if any exists
    if( errors?.length ) {
        let errorMsg = `Error loading configuration!\r\n`;
        for(let err of errors) {
            errorMsg += `[Config key: ${err.key}, Env.Object param name: ${err.envName}, Env.Object index: ${err.envIdx}] Exception message: ${err.ex.message}\r\n`;
        }
        throw new Error(errorMsg);
    }
    return thatConfig as R;
};

/**
 * **This is an internal function.**  
 * 
 * This function parse a {@link EnvConfig} configuration from an object of Environment Variables.  
 * This functions is called by {@link loadConfig}.  
 * *Prefer the {@link loadConfig} function to load configurations.*
 * 
 * @param config Type {@link EnvConfig}, the definition of how to load configuration from `envObj` parameter.
 * @param envObj Object from which configurations will be loaded *(the Environment Variable's object)*.
 * @returns The loaded configuration.
 */
export function parseConfig<T extends EnvConfig,
    R =   T['type'] extends 'string' ? string
        : T['type'] extends 'number' ? number
        : T['type'] extends 'boolean' ? boolean
        : T['type'] extends 'string[]' ? string[]
        : T['type'] extends 'number[]' ? number[]
        : T['type'] extends 'boolean[]' ? boolean[]
        : any
>
(config: T, envObj: Record<string, any>): R {
    let envStr = envObj[ config.name ] ;
    let type = config.type || 'auto';
    let value: any = '';
    if( type.endsWith('[]') ) {
        let separator = config.separator || /\s*[,;]+\s*/g ;
        let arrEnvStr = Array.isArray( envStr ) ? envStr : ( isString(envStr) ? envStr.split(separator) : [] ) ;
        value = [] as EnvConfigValueField[];
        for(let item of arrEnvStr) {
            if( isString( item ) ) item = item.trim();
            if( type === 'auto[]' ) value.push( parseAuto( item ) );
            if( type === 'boolean[]' ) value.push( parseBoolean( item ) );
            if( type === 'number[]' ) value.push( parseNumber( item ) );
            if( type === 'string[]' ) value.push( item || '' );
        }
        if( !value.length ) value = config.defaultValue as EnvConfigValueField[] ;

    } else {
        if( type === 'auto' ) value = parseAuto( envStr, config.defaultValue as any );
        if( type === 'boolean' ) value = parseBoolean( envStr, config.defaultValue as boolean );
        if( type === 'number' ) value = parseNumber( envStr, config.defaultValue as number );
        if( type === 'string' ) value = ''+ (envStr || config.defaultValue as string );
    }
    return value as R;
};

// ------------------------------------------------

const regexpBoolean = /\s*true\s*|\s*false\s*/i;
const regexpNumber = /^\s*(\-|(0x)?)(\d[\d_]*|[\d_]*\.\d[\d_]*)\s*$/;

/**
 * This function will check if the `value` parameter can be parsed to a `boolean`.  
 * The `value` can be a primitive boolean, or a string that mit the rule of the {@link regexpBoolean} RegEx.  
 * Anything else will return `false`.  
 * 
 * @param value Value to be checked
 * @returns If the `value` parameter is a `boolean`
 */
export const isBoolean = (value: any): boolean => typeof value === 'boolean' || regexpBoolean.test(value) ;
/**
 * This function will check if the `value` parameter can be parsed to a `number`.  
 * The `value` can be a primitive number, or a string that mit the rule of the {@link regexpNumber} RegEx.  
 * Anything else will return `false`.  
 * 
 * @param value Value to be checked
 * @returns If the `value` parameter is a `number`
 */
export const isNumber = (value: any): boolean => typeof value === 'number' || regexpNumber.test(value) ;
/**
 * This function will check if the `value` parameter is a `string`.  
 * Anything else will return `false`.  
 * 
 * @param value Value to be checked
 * @returns If the `value` parameter is a `string`
 */
export const isString = (value: any): boolean => typeof value === 'string' ;

// ------------------------------------------------

/**
 * Parse parameter `value` to a boolean value.  
 * If a primitive boolean is set for the `value` parameter, then that will be returned.  
 * If a string is set for the `value` parameter, then parse will try to read `true` or `false` from it.  
 * Else return the `defaultValue`.  
 * 
 * If no `defaultValue` value is set, or `defaultValue` is set to `undefined`, then an `Error` is thrown. 
 * 
 * @param value The data to parse, or a primitive boolean to return
 * @param defaultValue The default value to return if the `value` parameter cannot be parsed
 * @returns The boolean parsed, or the `defaultValue`
 * @throws Error if `value` cannot be parsed and `defaultValue` is not set
 */
export const parseBoolean = (value: any, defaultValue?: boolean|undefined): boolean => {
    if( !isBoolean(value) ) {
        if( defaultValue === undefined ) throw Error('The value "'+value+'" is not a boolean!');
        else return defaultValue;
    }
    if( !isString(value) ) return value; // is just a boolean
    return value.trim().toLowerCase() === 'true';
};
/**
 * Parse parameter `value` to a number value.  
 * If a primitive number is set for the `value` parameter, then that will be returned.  
 * If a string is set for the `value` parameter, then parse will try to read a number from it.  
 * Else return the `defaultValue`.  
 * 
 * If no `defaultValue` value is set, or `defaultValue` is set to `undefined`, then an `Error` is thrown.  
 * 
 * For example, the following strings can be parsed to numbers:  
 * - `0`
 * - `10.35`
 * - `10_000.35`
 * 
 * @param value The data to parse, or a primitive number to return
 * @param defaultValue The default value to return if the `value` parameter cannot be parsed
 * @returns The number parsed, or the `defaultValue`
 * @throws Error if `value` cannot be parsed and `defaultValue` is not set
 */
export const parseNumber = (value: any, defaultValue?: number|undefined): number => {
    if( !isNumber(value) ) {
        if( defaultValue === undefined ) throw Error('The value "'+value+'" is not a number!');
        else return defaultValue;
    }
    if( !isString(value) ) return value; // is just a number
    return parseFloat( value.trim().replace(/_/g,'') );
};
/**
 * Parse parameter `value` to a number, or boolean, or string.  
 * First, will try parsing a number.  
 * Second, will try a number.  
 * Third will try a string.  
 * 
 * In the end, if no one of the previous is returned, then will return `value || defaultValue`.  
 * So will return `value` if it is some **true** value, or return `defaultValue` otherwise.
 * 
 * @param value The data to parse
 * @param defaultValue The value to return if none of the strategies can parse the value
 * @returns The parsed value
 */
export const parseAuto = (value: any, defaultValue?: EnvConfigValueField): EnvConfigValueField => {
    if( isBoolean( value ) ) return parseBoolean( value );
    if( isNumber( value ) ) return parseNumber( value );
    if( isString( value ) ) value = value.trim();
    return value || defaultValue ;
};