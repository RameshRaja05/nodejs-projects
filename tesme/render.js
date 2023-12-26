import jsdom from "jsdom";
import path from "path";

const {JSDOM}=jsdom;

const render=async(filename)=>{
    const filePath=path.join(process.cwd(),filename);
    const dom=await JSDOM.fromFile(filePath,{
        resources:"usable",
        runScripts:"dangerously"
    })
    return new Promise((resolve,reject)=>{
        dom.window.document.addEventListener("DOMContentLoaded",()=>{
            resolve(dom)
        });
    });
};

export default render;