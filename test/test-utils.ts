
export async function assertThrows(msg: string, func: (()=>void)) {
    let throwed = false;
    try {
        await func();
    } catch(ex: any) {
        throwed = true;
    }
    if( !throwed ) throw Error(`"assertThrows" does not catch an Exception, so something is wrong: ${msg}`);
}
