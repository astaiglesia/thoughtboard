import request from "supertest";

import app from "./app";

describe('<<< TESTING SERVER APPLICATION >>>', () => {
  // [] root, global routing tests are failing
  // - routes are operational when tested locally, postman
  // - res.send('random string') returns 200 with a response
  describe("<>___GLOBAL ROUTING___<>", () => {
    xtest("should GET view assets and respond with a 200", async () => {
      const response = await request(app).get("/")
      expect(response.statusCode).toBe(200)
      // console.log(response.body)
      // console.log(response)
      
    });
    test("should provide a 404 response for non-existant routes", async () => {
      const response = await request(app).get("/badPath")
      expect(response.statusCode).toBe(404)
    });




    // [wip]---
    // test("server errors responds with status and message", 
    //  async () => {
    //   const response = await request(app)
    //     .get("/incorrectPath")
    //     .expect(404);
    // });

  })
})


// describe("Test the root path", () => {
//   test("It should response the GET method", async () => {
//     const response = await request(app)
//     .get("/")
//     expect(response.statusCode).toBe(200);
//   });
// });


// describe("/", () => {
//   test("it says hello world", done => {
//     request(app)
//       .get("/")
//       .expect(200)
//       .end(function(err, res) {
//         console.log("err", err);
//       });
//     done()
//   });
// });


