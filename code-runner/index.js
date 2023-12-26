#!/usr/bin/env node
import chokidar from "chokidar";
import { debounce } from "./helpers.js";
// import debounce from "lodash.debounce";
import program from "caporal";
import { access } from "node:fs/promises";
import {spawn} from "child_process";
import chalk from "chalk";

program
  .version("0.1.1")
  .argument("[filename]", "Name of file to execute")
  .action(async ({ filename }) => {
    const name = filename || "index.js";
    //check if file exits in current directory
    try {
      await access(name);
    } catch (error) {
      throw new Error(`Failed to find the file ${name}`);
    }
    let proc;
    const start = debounce(() => {
      if(proc){
        proc.kill()
      }
      console.log(chalk.magenta(">>>>>>>>>starting process...."));
      proc=spawn("node",[name],{stdio:"inherit"});
    }, 250);
    chokidar
      .watch(process.cwd())
      .on("add", start)
      .on("change",start)
      .on("unlink", start);
  });

program.parse(process.argv);
