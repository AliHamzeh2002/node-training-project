const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})

const doc = {
    info: {
        version: "1.0.0",
        title: "Social Media API",
        description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "User",
            "description": "Endpoints"
        },
        {
            "name": "Post",
            "description": "Endpoints"
        },
        {
            "name": "Like",
            "description": "Endpoints"
        }
    ],
    definitions: {
        User:{
            $name: "ali",
            $username: "username1",
            age: 29,
            $email: "felan@felan.com",
            $phoneNumber:"01234567890",
            $password: "password",
            posts: [{
                $ref: '#/definitions/Post'
            }]
        },
        Post:{
            $title: "title",
            $text: "sample text for the post...",
            $author: {
                $ref: "#/definitions/User"
            },
            likes:[{
                $ref: "#/definitions/Like"
            }]
        },
        Like:{
            $postId: {
                $ref: "#/definitions/Post"
            },
            $userId: {
                description: "only id is saved",
                $ref: "#/definitions/User"
            },
        },
        AddUser:{
            $name: "ali",
            $username: "username1",
            age: 29,
            $email: "felan@felan.com",
            $phoneNumber:"01234567890",
            $password: "password",
        },
        AddPost:{
            $title: "title",
            $text: "sample text for the post...",
        },
        AddLike:{
            $postId: "123456789"
        }  

    }
}


const outputFile = './swagger-output.json'
const endpointsFiles = ['./index.js']

swaggerAutogen(outputFile, endpointsFiles, doc);