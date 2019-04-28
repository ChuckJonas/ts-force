export const NULL = 'NULL';

export const stringFormatter = (val: string) => {
    return `'${val}'`;
};

export const dateFormatter = (val: Date) => {
    return val.toISOString().slice(0, 10);
};

export const dateTimeFormatter = (val: Date) => {
    return val.toISOString();
};

export const listFormatter = (val: string[]) => {
    return `(${val.map(v => `'${v}'`).join(', ')})`;
};

