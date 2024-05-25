import { supertest } from "supertest";
import { server } from "../app";

describe("Auth", () => {
  it("should register a new user", async () => {
    const response = await supertest(server).post("/user/register").send({
      first_name: "Adetayo",
      last_name: "Adewobi",
      email: "adetayo@gmail.com",
      password: "test12",
      confirm_password: "test12",
    });
    console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Registration successful");
    expect(response.body.data).toHaveProperty("_id");
  });

  it("should not register a user with existing email", async () => {
    const response = await supertest(server).post("/user/register").send({
      first_name: "Adetayo",
      last_name: "Adewobi",
      email: "adetayo@gmail.com",
      password: "test12",
      confirm_password: "test12",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Email is taken");
  });

  it("should login a user", async () => {
    const response = await supertest(server).post("/user/login").send({
      email: "adetayo@gmail.com",
      password: "test12",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body).toHaveProperty("token");
  });

  it("should not login a user with incorrect credentials", async () => {
    const response = await request(app).post("/user/login").send({
      email: "adetayo@gmail.com",
      password: "test12",
    });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Email and password do not match");
  });
});
