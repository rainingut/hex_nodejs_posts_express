const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        "version": "1.0",             // by default: "1.0.0"
        "title": "Meta Wall",         // by default: "REST API"
        "description": "貼文牆"        // by default: ""
    },
    host: "",                         // by default: "localhost:3000"
    basePath: "",                     // by default: "/"
    schemes: ['http', 'https'],       // by default: ['http']
    consumes: [],                     // by default: ['application/json']
    produces: [],                     // by default: ['application/json']
    tags: [                           // by default: empty Array
        {
            name: "Users",
            description: "使用者"
        },
        {
            name: "Posts",
            description: "貼文"
        },
    ],
    securityDefinitions: {
        //https://github.com/davibaltar/swagger-autogen/issues/98
        Bearer: {
            type: "apiKey",
            in: "header", // can be "header", "query" or "cookie"
            name: "Authorization", // name of the header, query parameter or cookie
            description:
                "Please enter a valid token to test the requests below...",
        },
    },       // by default: empty object
    definitions: { }                  // by default: empty object
}



const outputFile = './swagger_output.json'; // 輸出的文件名稱
const endpointsFiles =['./app.js']; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

swaggerAutogen(outputFile, endpointsFiles, doc);