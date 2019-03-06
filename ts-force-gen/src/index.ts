#! /usr/bin/env node
/// <reference types="node" />
import { BaseConfig, OAuth, UsernamePasswordConfig, setDefaultConfig } from '../../ts-force';
import Ast, { SourceFile } from 'ts-simple-ast';
import { SObjectGenerator, TS_FORCE_IMPORTS } from './sObjectGenerator';
import * as minimist from 'minimist';
import * as fs from 'fs';
import * as path from 'path';
import { SObjectConfig } from './sObjectConfig';
import { cleanAPIName, replaceSource } from './util';
import { Spinner } from 'cli-spinner';

// Config Types
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

// execute
run();

function run () {
    checkVersion()
    .then(generateLoadConfig)
    .then((config) => generate(config))
    .catch(e => {
        console.log('Failed to Generate!  Check config or cmd params!');
        console.log(e);
    });
}

// Checks that the installed version ts-force matches this package
async function checkVersion () {

    let tsforce: string;
    let gen: string;
    try {
        gen = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).version;
    }catch (e) {
        console.warn('Failed to detect package version of ts-force-gen');
        return;
    }

    for (let dir of fs.readdirSync('node_modules')) {
        try {
            if (dir === 'ts-force') {
                let json = JSON.parse(fs.readFileSync(path.join('node_modules', dir, 'package.json'), 'utf8'));
                tsforce = json.version;
            }
        }catch (err) {}
    }
    if (gen !== tsforce) {
        console.warn(`The version of ts-force-gen (${gen}) should match ts-force (${tsforce}). It is recommended that you run \`npm install -D ts-force-gen@${tsforce}\` and regenerate classes`);
    }
}

// init the configuration, either from a json file, command line augs or both
async function generateLoadConfig (): Promise<Config> {

    let args = minimist(process.argv.slice(2));

    let config: Config = {};

    let configPath = args.config || args.j;
    if (configPath) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    if (!config.auth) {
        config.auth = {};
    }

    // setup commandline args

    if (args.e) {
        config.auth.clientId = process.env.CLIENT_ID;
        config.auth.clientSecret = process.env.CLIENT_SECRET;
        config.auth.username = process.env.USERNAME;
        config.auth.password = process.env.PASSWORD;
        config.auth.oAuthHost = process.env.HOST;
    }

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
            throw new Error('No valid authentication configuration found!');
        }
    }

    // could also retrieve this using sfdx
    setDefaultConfig(config.auth);

    return config;

}

// generate the classes
async function generate (config: Config) {

    let spinner = new Spinner({
        text: 'warming up...',
        stream: process.stderr,
        onTick: function (msg) {
            this.clearLine(this.stream);
            this.stream.write(msg);
        }
    });
    spinner.setSpinnerString(5);
    spinner.setSpinnerDelay(20);
    spinner.start();

    let save = true;
    if (config.outPath == null) {
        config.outPath = './placeholder.ts';
        save = false;
    }

    let singleFileMode = false;
    if (config.outPath.endsWith('.ts')) {
        singleFileMode = true;
    }

    let sobConfigs = config.sObjects.map(item => {
        let objConfig: SObjectConfig;
        if (typeof item === 'string') {
            objConfig = {
                apiName: item,
                className: null,
                autoConvertNames: true
            };
        }else {
            objConfig = item;
        }

        objConfig.autoConvertNames = objConfig.autoConvertNames || true;
        objConfig.className = objConfig.className || sanitizeClassName(objConfig);

        return objConfig;
    });

    let index: SourceFile;
    if (singleFileMode) {
        index = replaceSource(config.outPath);
        index.addImportDeclaration(TS_FORCE_IMPORTS);
    }else {
        // create index so we can easily import
        let indexPath = path.join(config.outPath, 'index.ts');
        index = replaceSource(indexPath);
    }

    for (let sobConfig of sobConfigs) {
        spinner.setSpinnerTitle(`Generating: ${sobConfig.apiName}`);

        let classSource: string | SourceFile;
        if (singleFileMode) {
            classSource = index;
        }else {
            index.addExportDeclaration({
                moduleSpecifier: `./${sobConfig.className}`
            });
            classSource = path.join(config.outPath,`${sobConfig.className}.ts`);
        }

        let gen = new SObjectGenerator(
            classSource,
            sobConfig,
            sobConfigs
        );
        try {
            let source = await gen.generateFile();

            if (!singleFileMode) {
                source.formatText();
                if (save) {
                    await source.save();
                }else {
                    console.log(source.getText());
                }
            }
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }

    index.formatText();
    if (save) {
        await index.save();
    }else {
        console.log(index.getText());
    }
    spinner.stop();

}

function sanitizeClassName (sobConfig: SObjectConfig): string {
    if (sobConfig.autoConvertNames) {
        return cleanAPIName(sobConfig.apiName);
    }
    return sobConfig.apiName;
}
