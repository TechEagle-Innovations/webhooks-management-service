
export interface OnRequest {
    topic: string; 
    body: any; 
    headers: Record<string, string> | {}; 
    method: string; 
    param: string; 
    query: Query | {}; 
  }

export interface Query{
    eventName?:string,
    userEmail?:string,
    userId?:string,
    callbackLink?:string,
    serviceName?:string,
    projectName?:string,
    createdBy?:string,
    updatedBy?:string
    
}

