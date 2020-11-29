const supertest = require('supertest');
const {clearTable} = require('../utils/user_db');
const app = require("../app");
const server = require('../app');

describe("Testing the User API", () => {

        //Test for create new User 
        it("test for creating a new user and getting success as status", async () => {

            const response = await supertest(app).post("/user/signup").send({
                username: "New User",
                lastname: "Test Created",
                login: "newuserlogin",
                password: "login"
            });

            expect(response.status).toBe(200);
        });


        afterEach( () => {
            server.close()
            clearTable("newuserlogin")
        })

})