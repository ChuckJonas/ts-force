#! /usr/bin/env node
/// <reference types="node" />
import { BaseConfig } from '../';
import Ast from 'ts-simple-ast';
import { SObjectGenerator } from './sObjectGenerator';
import { Rest } from '../main/lib/rest';
import * as minimist from 'minimist';
import * as path from 'path';
import * as fs from 'fs';
import { OAuth, UsernamePasswordConfig } from '../auth/oauth';
import { SObjectConfig } from './sObjectConfig';

interface AuthConfig extends BaseConfig {
    username?: string;
    password?: string;
    oAuthHost?: string;
    clientId?: string;
    clientSecret?: string;
}

interface Config {
    auth?: AuthConfig;
    sObjects?: (string|SObjectConfig)[];
    exclude?: Map<string, string[]>;
    outPath?: string;
}

run();

function run () {
    generateLoadConfig().then(config => {
        generate(config);
    }).catch(e => {
        console.log('Failed to Authinicate.  Check config or cmd params!');
    });

}

async function generateLoadConfig (): Promise<Config> {

    let args = minimist(process.argv.slice(2));

    let config: Config = {};
    let configPath = args.config || args.j;
    if (configPath) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    // setup commandline args

    if (args.c || args.clientId) {
        config.auth.clientId = args.c || args.clientId;
    }
    if (args.x || args.clientSecret) {
        config.auth.clientSecret = args.x || args.clientSecret;
    }
    if (args.u || args.username) {
        config.auth.username = args.u || args.username;
    }
    if (args.p || args.password) {
        config.auth.password = args.p || args.password;
    }
    if (args.h || args.oAuthHost) {
        config.auth.oAuthHost = args.h || args.oAuthHost;
    }
    if (args.accessToken || args.a) {
        config.auth.accessToken = args.accessToken || args.a;
    }
    if (args.instanceUrl || args.i) {
        config.auth.instanceUrl = args.instanceUrl || args.i;
    }
    if (args.outputFile || args.o) {
        config.outPath = args.outputFile || args.o;
    }

    if (args.sObjects || args.s) {
        config.sObjects = (args.sObjects || args.s).split(',');
    }

    if (config.auth.accessToken === undefined) {
        // if just username is set, load from sfdx
        if (config.auth.username !== undefined && config.auth.password === undefined) {

            let childProcess = require('child_process');
            let orgInfo = JSON.parse(childProcess.execSync(`sfdx force:org:display -u ${config.auth.username} --json`).toString('utf8'));

            config.auth.accessToken = orgInfo.result.accessToken;
            config.auth.instanceUrl = orgInfo.result.instanceUrl;
        }else if (config.auth.username !== undefined && config.auth.password !== undefined) {

            // otherwise lets try username/password flow
            let pwConfig = new UsernamePasswordConfig(
                config.auth.clientId,
                config.auth.clientSecret,
                config.auth.oAuthHost,
                config.auth.username,
                config.auth.password
            );

            let oAuth = new OAuth(pwConfig);
            await oAuth.initialize();
            config.auth = oAuth;
        }else {
            throw new Error('No valid authinication configuration found!');
        }
    }

    // could also retrieve this using sfdx
    Rest.config = config.auth;
    Rest.config.version = 40; // should be moved to config

    return config;

}

function generate (config: Config) {
    const ast = new Ast();
    let save = true;
    if (config.outPath == null) {
        config.outPath = './tmp.ts';
        save = false;
    }
    fs.unlinkSync(config.outPath);
    const source = ast.createSourceFile(config.outPath);

    let sobConfigs = config.sObjects.map(item => {
        if (typeof item === 'string') {
            return {
                apiName: item,
                autoConvertNames: true
            };
        }
        if (item.autoConvertNames === undefined) {
            item.autoConvertNames = true;
        }
        return item;
    });

    let gen = new SObjectGenerator(
        source,
        sobConfigs
    );

    gen.generateFile().then(() => {
        source.formatText();
        console.log(source.getText());
        if (save) {
            source.save();
        }
    }).catch(error => {
        console.log(error);
    });
}
