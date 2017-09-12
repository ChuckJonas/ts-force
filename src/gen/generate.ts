#! /usr/bin/env node
import { BaseConfig } from '../';
import Ast from "ts-simple-ast";
import { SObjectGenerator } from "./sObjectGenerator";
import { Rest } from "../main/lib/rest"
import * as minimist from 'minimist';
import * as path from 'path';
import * as fs from 'fs';

interface DXConfig extends BaseConfig{
  userAlias: string;
}

interface Config{
  auth: DXConfig
  sObjects: string[];
  exclude?: Map<string, string[]>;
  outPath: string;
}

run();

function run(){
  let config = generateLoadConfig();
  generate(config);
}

function generateLoadConfig(): Config{

  var args = minimist(process.argv.slice(2));

  var configPath = args.config || args.c;

  let config: Config;
  if(configPath){
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }else{
    config = {
      auth: {
        userAlias: args.u || args.userAlias,
        accessToken: args.accessToken || args.a,
        instanceUrl: args.instanceUrl || args.i
      },
      outPath: args.outputFile || args.o,
      sObjects: (args.sObjects || args.s).split(','),
    }
  }

  //load from sfdx
  if(config.auth.userAlias !== undefined){
      var child_process = require('child_process');
      var orgInfo = JSON.parse(child_process.execSync(`sfdx force:org:display -u ${config.auth.userAlias} --json`).toString('utf8'));

      config.auth.accessToken = orgInfo.result.accessToken;
      config.auth.instanceUrl = orgInfo.result.instanceUrl;
    }

  //could also retrieve this using sfdx
  Rest.config = config.auth;

  return config;

}

function generate(config: Config){
  const ast = new Ast();
  let save = true;
  if(config.outPath == null){
    config.outPath = './tmp.ts';
    save = false;
  }
  const source = ast.addSourceFileFromStructure(config.outPath, {});

  let gen = new SObjectGenerator(
    source,
    config.sObjects
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
}