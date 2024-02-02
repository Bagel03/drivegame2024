declare global {
    interface Promise<T> {
        /** will reject the promise after a certain amount of time if it has not been fulfilled */
        timeout(ms: number): Promise<T>;
    }

    interface PromiseConstructor {
        timeout(ms: number): Promise<never>;
    }
}

Promise.timeout = function (ms: number) {
    return new Promise((res) => setTimeout(res, ms));
};

Promise.prototype.timeout = function (ms: number) {
    return Promise.race([this, Promise.timeout(ms)]);
};
export {};
