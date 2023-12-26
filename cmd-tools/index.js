#!/usr/bin/env node

//todo method 3 using latest promise based solution for ls command
import { readdir,lstat } from 'node:fs/promises';
import path from 'node:path';

const targetDir=process.argv[2]||process.cwd();

try {
    const files=await readdir(targetDir);
    for(let file of files){
        const stats=await lstat(path.join(targetDir,file));
        if(stats.isDirectory()){
            console.log("\x1b[36m",`${file}/`);
        }
        if(stats.isFile()){
            console.log("\x1b[32m",file);
        }
    }
} catch (err) {
   throw new Error(err);    
}

//todo method 1 using outdated callback based module


// import {readdir,lstat} from "fs";

// readdir(process.cwd(),(err,filenames)=>{
//     if(err){
//         throw new Error(err);
//     }
//     const allStats=Array(filenames.length).fill(null);
//     for(let filename of filenames){
//         lstat(filename,(err,stats)=>{
//             const index=filenames.indexOf(filename);
//             if(err){
//                 return new Error(err);
//             }
//             allStats[index]=stats;
//             if(!allStats.includes(null)){
//                 allStats.forEach((stat,index)=>{
//                     if(stat.isDirectory()){
//                         console.log("\x1b[36m",`${filenames[index]}/`);
//                     }
//                     if(stat.isFile()){
//                         console.log("\x1b[32m",filenames[index]);
//                     }
//                 })
//             }
//         })
//     }
// })


//todo writing our own promises to handle asynchronus functions method 2

// import {readdir,lstat} from "fs";
// import{promisify} from "util";


// const plstat=promisify(lstat);
// //custom function to wrap promise in lstat
// const pLstat=(filename)=>{
//     return new Promise((resolve,reject)=>{
//         lstat(filename,(err,stats)=>{
//             if(err){
//                 reject(err);
//             }
//             resolve(stats);
//         })
//     })
// }


// readdir(process.cwd(),(err,filenames)=>{
//     if(err){
//         throw new Error(err);
//     }
//     for(let filename of filenames){
//        plstat(filename)
//        .then(stat=>{
//         if(stat.isDirectory()){
//             console.log("\x1b[36m",`${filename}/`);
//         }
//         if(stat.isFile()){
//             console.log("\x1b[32m",filename);
//         }
//        })
//        .catch(err=>{
//         throw new Error(err);
//        })
//     }
// })

//todo final accepted solution from author

// import {readdir} from "fs";
// import {lstat} from "node:fs/promises"

// readdir(process.cwd(),async(err,filenames)=>{
//     if(err){
//         throw new Error(err);
//     }
//     const statPromises=filenames.map(filename=>{
//         return lstat(filename);
//     })
//     const stats=await Promise.all(statPromises);
//     for(let stat of stats){
//         const index=stats.indexOf(stat);
//         if(stat.isDirectory()){
//             console.log("\x1b[36m",`${filenames[index]}/`);
//         }
//         if(stat.isFile()){
//             console.log("\x1b[32m",filenames[index]);
//         }
//     }
// })