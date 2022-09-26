import { Project, SourceFile } from 'ts-morph';
import * as fs from 'fs';

const SUFFIXES_REPLACEMENTS = {'__c': '', '__r': '', '__pc': 'PC', '__pr': 'PR'};
const API_NAME_REGEX = /(?:^((?:\w(?!__))+\w)__|^)(.*)$/;

export const cleanAPIName = (sfName: string, keepNamespaces: boolean) => {
  let name = sfName;
  Object.keys(SUFFIXES_REPLACEMENTS).forEach((key) => {
      name = name.replace(new RegExp(key + '$'), SUFFIXES_REPLACEMENTS[key]);
  });
  let match = API_NAME_REGEX.exec(name);
  if (!match) {
    throw new Error('NO MATCH FOUND FOR ' + sfName);
  }
  name = (keepNamespaces && match[1] ? match[1] : '') + match[2];
  const parts = name.split('_');
  return parts.map((p, i) => {
    if(i > 0 && p.length) {
      return p.charAt(0).toUpperCase() + p.slice(1);
    }
    return p;
  }).join('');
};

export const replaceSource = (path: string): SourceFile => {
  try {
    fs.unlinkSync(path);
  } catch (e) { }
  let ast = new Project();
  return ast.createSourceFile(path);
};
