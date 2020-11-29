const supertest = require('supertest');
const {clearTable} = require('../utils/notes_db');
const app = require("../app");
const server = require('../app');

describe("Testing the Notes API", () => {

        //Test for create new User 
        it("test for creating a new note and getting success as status", async () => {

            const response = await supertest(app).post("/notes/88/create").send({
                owner: 88,
                note: "# My Test.Jest Note",
                created: new Date().toString(),
                modified: null,
                link: "https://localhost:8080/shared/88/11"
            });

            expect(response.status).toBe(200);
        });


        afterEach( () => {
            server.close()
            clearTable("# My Test.Jest Note")
        })

})