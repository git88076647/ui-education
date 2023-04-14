const logTraceIDs = new Array();

export function push(traceid,apmtraceid) {
  //  console.log('LogTraceID'+trace);
  if(!traceid || traceid == ''){
    return;
  }
  logTraceIDs.push({traceid:traceid,apmtraceid:apmtraceid,ts:new Date().getTime()});
  if(logTraceIDs.length > 20){
    logTraceIDs.shift();
  }
}

export function getAll() {
  // return logTraceIDs;
  return logTraceIDs.reverse();
}


