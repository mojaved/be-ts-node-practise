export function logInvocation(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const className = target.constructor.name;
    let originalMethod = descriptor.value;
    descriptor.value = async function name(...args: any[]) {
        console.log(`${className}#${propertyKey} called with ${JSON.stringify(args)}`);
        const result = await originalMethod.apply(this, args);
        console.log(`${className}#${propertyKey} returned: ${JSON.stringify(result)}`);
        return result;
    }
    return descriptor;
}

export function delayResponse(delayMS: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let originalMethod = descriptor.value;
        descriptor.value = async function name(...args: any[]) {
            const result = await originalMethod.apply(this, args);
            await delay(delayMS);
            return result;
        }
    }
}

async function delay(timeout: number) {
    return new Promise<void>((resolve) => setTimeout(() => {
        resolve();
    }, timeout));

}