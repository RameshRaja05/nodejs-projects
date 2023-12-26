import {readdir,lstat} from "node:fs/promises"
import path from "node:path";
import {pathToFileURL} from "url";
import chalk from "chalk";
import render from "./render.js"

const forbiddenDirs=["node_modules","build","dist",".next"];

class Runner{
    constructor(){
        this.testfiles=[];
    }
    async runTests(){
        for(let file of this.testfiles){
            console.log(chalk.bgCyan(`Running test cases for ${file.shortName}`))
            //we try to mock the mocha it and beforeEach and it is wrapper for our test function and beforeEach iy runs before our test cases run 
            const beforeEaches=[];
            const its=[];
            global.render=render;
            global.beforeEach=(func)=>{
                 beforeEaches.push(func);
            }
            global.it=async(desc,func)=>{
               its.push({desc,func});
            }
             try{
                const module=await import(pathToFileURL(file.name));
                for(let {desc,func} of its){
                    beforeEaches.forEach(beforeEach=>beforeEach());
                    try {
                        await func();
                        console.log(chalk.green(`\tOK---${desc}`));
                       } catch (error) {
                           const message=error.message.replace(/\n/g,'\n\t\t');
                           console.log(chalk.red(`\tX--->${desc}`));
                           console.log(chalk.red("\t",message));
                       }
                }
             }catch(err){
                console.log(err);
             }
        }
    }
    async collectFiles(targetPath){
        const queue=[targetPath];

        while(queue.length){

            const dir =queue.shift();
            const files=await readdir(dir);

            for(let file of files){
                const filePath=path.join(dir,file);
                const stats=await lstat(filePath);

                if(stats.isDirectory() && !forbiddenDirs.includes(file)){
                    queue.push(filePath)
                }
                
                if(stats.isFile() && file.toLowerCase().endsWith(".test.js")){
                    this.testfiles.push({name:filePath,shortName:file});
                }
            }
        }
        return this.testfiles;
    }
}

export default Runner;