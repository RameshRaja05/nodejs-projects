export const debounce=(cb,delay=100)=>{
    let timeOutId;
    return (...args)=>{
        if(timeOutId){
            clearTimeout(timeOutId);
        }
        timeOutId=setTimeout(()=>{
            cb.apply(null,args);
        },delay)
    }
}
