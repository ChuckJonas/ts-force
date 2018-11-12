import * as cprocess from 'child_process';
import * as fs from 'fs';

require('dotenv').config();
genClasses();

function genClasses () {
    cprocess.exec('ts-force-gen -e -s Account,Contact,User', (err, data) => {
        if (err) {
            console.log(err, data);
            process.exit(1);
        }
        let result = data.replace(/from "ts-force"/g, `from '../..'`);
        fs.writeFile('./src/test/testAssets/sobs.ts', result, (err) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
        });
    });
}
