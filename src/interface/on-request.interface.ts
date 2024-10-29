export interface OnRequest {
  topic: string; 
  body: any; 
  headers: Record<string, string>; 
  method: string; 
  params:  Record<string, string>;  
  query: Query | {}
}


export interface Query{
    id?: string,
    eventName?:string,
    userEmail?:string,
    callbackLink?:string,
    serviceName?:string,
    projectName?:string,
    createdBy?:string,
    updatedBy?:string
   
    
}

