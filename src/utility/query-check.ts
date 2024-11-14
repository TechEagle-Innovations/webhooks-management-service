import { Query } from "src/interface/on-request.interface";


const queryKeysShouldBe=["serviceName", "eventName", "createdBy", "updatedBy", "sampleData", "callbackLink","projectName"];

export const queryFilter=(query:Query)=>{
    return  Object.fromEntries(
        Object.entries(query).filter(([key, val]) => queryKeysShouldBe.includes(key))
      );
}