import Ast, { SourceFile } from 'ts-simple-ast';
import * as fs from 'fs';

export const cleanAPIName = (sfName: string) => {
    return sfName.replace('__c', '').replace('__r', '').replace(/_/g, '');
};

export const replaceSource = (path: string): SourceFile => {
    try {
        fs.unlinkSync(path);
    }catch (e) {}
    let ast = new Ast();
    return ast.createSourceFile(path);
};
