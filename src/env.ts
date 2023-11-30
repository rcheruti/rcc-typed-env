

declare type EnvConfigTypeField = 'auto' | 'boolean' | 'number' | 'string' ;
declare type EnvConfigValueField = boolean | number | string ;

/** Configurations to load environment variables */
export interface EnvConfig {
    /** The name of the variable. */
    name: string ;
    /** 
     * The type of the variable. Each type has a default value when no one is founded:  
     * - **auto**: will try differents parse strategies, and set to `null` by default if no one set.  
     * - **boolean**: will try parse boolean (words `false` or `true`), and set to `false` by default if no one set. It is Case-Insensitive.  
     * - **number**: will parse as number (using `parseFloat(...)`), and set to `0.0` by default if no one set.  
     * - **string**: will load as string (*'as is'*), and set to empty string (`""`) by default if no one set. Case is not changed.  
     * 
     * Default type is `auto`.
     */
    type?: EnvConfigTypeField;
    /** 
     * Indicates that this is a list/array.  
     * The itens are separated with value of the `separator` field.  
     * E.g.: `[ Item one, 2, item 3 ]`.
     * 
     * When field `type` is defined with `auto` a mixed typed Array will be parsed,
     * otherwise a unique typed Array is parsed, with parsing errors set to `defaultValue` *(if set)*.
     * 
     * Default is `false`.
     */
    isArray?: boolean ;
    /**
     * Separator to use when `isArray` is `true`.  
     * *In case of `RegExp` remember to use the `g` modifier. E.g.: `/;/g` or `/,/g`*  
     * 
     * Default separator is `/[,;]/g`;
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
 * Loads configurations from environment variables.  
 * E.g.:  
 * ```js
 * {
 *      databaseURL: { name: 'DATABASE_URL' },
 *      connectionPool: { name: 'DATABASE_CONNECTION_POOL', type: 'number', defaultValue: 10 },
 * }
 * ```
 * 
 * Use it to define the global configuration object:  
 * `export const Config = loadConfig({ ... });`
 * 
 * @param config Environment variables definition
 * @param envObj Environment variables
 * @returns Loaded configuration from environment variables
 */
export function loadConfig<T extends EnvDefinition, 
    R = {
        [P in keyof T]: 
        T[P]['type'] extends 'string' 
            ? T[P]['isArray'] extends true ? string[] : string
            : T[P]['type'] extends 'number' 
                ? T[P]['isArray'] extends true ? number[] : number
                : T[P]['type'] extends 'boolean' 
                    ? T[P]['isArray'] extends true ? boolean[] : boolean
                    : T[P]['type'] extends 'auto' 
                        ? T[P]['isArray'] extends true ? any[] : any
                        : undefined
    }
>
(config: T, envObj: NodeJS.ProcessEnv = process.env): R {
    let thatConfig: any = {  };
    for(let key in config) {
        let cfg = config[ key ];
        thatConfig[ key ] = parseConfig( cfg, envObj );
    }
    return thatConfig as R;
};

export function parseConfig<T extends EnvConfig,
    R = T['type'] extends 'string' 
            ? ( T['isArray'] extends true ? string[] : string ) 
            : T['type'] extends 'number' 
                ? ( T['isArray'] extends true ? number[] : number ) 
                : T['type'] extends 'boolean' 
                    ? ( T['isArray'] extends true ? boolean[] : boolean ) 
                    : any
>
(config: T, envObj: NodeJS.ProcessEnv = process.env): R {
    let envStr = envObj[ config.name ] || '';
    let type = config.type || 'auto';
    let value: any = '';
    if( config.isArray ) {
        let separator = config.separator || /[,;]/g ;
        let arrEnvStr = envStr.split(separator);
        value = [];
        for(let item of arrEnvStr) {
            if( !item || !item.trim() ) continue;
            if( type === 'auto' ) (value as EnvConfigValueField[]).push( parseAuto( item.trim(), '' ) );
            if( type === 'boolean' ) (value as EnvConfigValueField[]).push( parseBoolean( item.trim(), false ) );
            if( type === 'number' ) (value as EnvConfigValueField[]).push( parseNumber( item.trim(), 0 ) );
            if( type === 'string' ) (value as EnvConfigValueField[]).push( item.trim() || '' );
        }
        if( !value.length ) value = config.defaultValue as EnvConfigValueField[] ;

    } else {
        if( type === 'auto' ) value = parseAuto( envStr, config.defaultValue as any );
        if( type === 'boolean' ) value = parseBoolean( envStr, config.defaultValue as boolean || false );
        if( type === 'number' ) value = parseNumber( envStr, config.defaultValue as number || 0 );
        if( type === 'string' ) value = envStr || config.defaultValue as string || '';
        if( config.isArray ) value = [ value ];
    }
    return value as R;
};

// ------------------------------------------------

const regexpBoolean = /\s*true\s*|\s*false\s*/i;
const regexpNumber = /^\s*(\d[\d_]*|[\d_]*\.\d[\d_]*)\s*$/;
// const regexpArray = /^\s*\[.*\]\s*$/;

// export const checkAuto = (value: any) => null ;
export const isBoolean = (value: any): boolean => typeof value === 'boolean' || regexpBoolean.test(value) ;
export const isNumber = (value: any): boolean => typeof value === 'number' || regexpNumber.test(value) ;
export const isString = (value: any): boolean => typeof value === 'string' ;

// ------------------------------------------------

/**
 * Parse a string to a boolean value.  
 * If a primitive boolean is set for the `value` parameter, then that will be returned.  
 * Else return the `defaultValue`.  
 * 
 * If no `defaultValue` value is set, or `defaultValue` is set to `null/undefined`, then an `Error` is thrown. 
 * 
 * @param value The string to parse, or a primitive boolean to return
 * @param defaultValue The default value to return if the `value` parameter cannot be parsed
 * @returns The boolean parsed, or the `defaultValue`
 */
export const parseBoolean = (value: any, defaultValue: boolean|null|undefined = null): boolean => {
    if( !isBoolean(value) ) {
        if( defaultValue === null || defaultValue === undefined ) throw Error('The value "'+value+'" is not a boolean!');
        else return defaultValue;
    }
    if( !isString(value) ) return value; // is just a boolean
    return value.trim().toLowerCase() === 'true';
};
/**
 * Parse a string to a number value.  
 * If a primitive number is set for the `value` parameter, then that will be returned.  
 * Else return the `defaultValue`.  
 * 
 * If no `defaultValue` value is set, or `defaultValue` is set to `null/undefined`, then an `Error` is thrown. 
 * 
 * @param value The string to parse, or a primitive number to return
 * @param defaultValue The default value to return if the `value` parameter cannot be parsed
 * @returns The number parsed, or the `defaultValue`
 */
export const parseNumber = (value: any, defaultValue: number|null|undefined = null): number => {
    if( !isNumber(value) ) {
        if( defaultValue === null || defaultValue === undefined ) throw Error('The value "'+value+'" is not a number!');
        else return defaultValue;
    }
    if( !isString(value) ) return value; // is just a number
    return parseFloat( value.trim().replace(/_/g,'') );
};
export const parseAuto = (value: any, defaultValue?: EnvConfigValueField): EnvConfigValueField => {
    if( isBoolean( value ) ) return parseBoolean( value );
    if( isNumber( value ) ) return parseNumber( value );
    return value || defaultValue ;
};