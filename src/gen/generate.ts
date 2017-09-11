#! /usr/bin/env node
import Ast from "ts-simple-ast";
import { SObjectGenerator } from "./sObjectGenerator";
import { Rest } from "../main/lib/rest"
import * as minimist from 'minimist';
import * as path from 'path';

const ast = new Ast();

var args = minimist(process.argv.slice(2));

//could also retrieve this using sfdx
Rest.config = {
  accessToken: args.accessToken || args.a,
  host: args.instanceUrl || args.i
}

let outPath = args.outputFile || args.o;
let save = true;
if(outPath == null){
  outPath = './tmp.ts';
  save = false;
}
const source = ast.addSourceFileFromStructure(outPath, {});

let sobs: string = args.sobs || args.s;
let gen = new SObjectGenerator(
  source,
  sobs.split(' ').join('').split(',')
);

gen.generateFile().then(()=>{
  source.formatText();
  console.log(source.getText());
  if(save){
    source.save();
  }
}).catch(error=>{
  console.log(error);
})

