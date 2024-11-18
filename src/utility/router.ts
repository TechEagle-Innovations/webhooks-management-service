export class Router {
  staticroutes = {
    GET: new Map(),
    POST: new Map(),
    PATCH: new Map(),
    PUT: new Map(),
    DELETE: new Map(),
    ALL: new Map(),
  };
}
  // staticroutes = new Map();
//   dynamicRoutes = {
//     GET: [],
//     POST: [],
//     PATCH: [],
//     PUT: [],
//     DELETE: [],
//     ALL: [],
//   };
//   constructor() {

//   }


//   // Add a new route with a path and handler
//   addRoute(method, path, handler) {
//     if (!path.includes(':')) {
//       this.staticroutes[method].set(path, { handler, params: {} })
//       return true
//     }
//     const paramNames = [];
//     const regexPath = path.replace(/:([^\/]+)/g, (_, paramName) => {
//       paramNames.push(paramName);
//       return '([^\\/]*)'; // Replace with regex for dynamic parts
//     });
//     const regex = new RegExp(`^${regexPath}$`);
//     this.dynamicRoutes[method].push({ regex, paramNames, handler });
//     console.log("this.dynamicRoutes[method]", method, this.dynamicRoutes[method])
//     const statPath = path.split("/:")[0]
//     console.log("statPath", statPath)
//     const params = {}
//     paramNames.forEach((field) => {
//       params[field] = ""
//     })
//     this.staticroutes[method].set(statPath, { handler, params })
//     return true
//   }

//   // Resolve a URL and execute the corresponding handler
//   resolve(method, url) {
//     console.log("method,url", method, url)
//     if (this.staticroutes[method].has(url)) {
//       // console.log("this.staticroutes[method].get(url)", this.staticroutes[method].get(url))
//       const { handler, params } = this.staticroutes[method].get(url)
//       return { routeExist: true, data: handler(params) }; //empty params
//     }
//     // console.log("this.dynamicRoutes[method]", method, this.dynamicRoutes[method])

//     for (const route of this.dynamicRoutes[method]) {
//       const match = url.match(route.regex);
//       if (match) {

//         const params = {};
//         route.paramNames.forEach((name, index) => {
//           params[name] = match[index + 1];
//         });
//         return { routeExist: true, data: route.handler(params) };
//       }
//     }
//     return this.handleNotFound();
//   }

//   // Fallback handler for unmatched routes
//   handleNotFound() {
//     console.log('404 - Not Found');
//     return { routeExist: false, data: null };
//   }
// }


