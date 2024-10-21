export function removeUnneccessoryObjectKeys(obj: object, keysTORemove = []) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, val]) => !keysTORemove.includes(key))
    );
}