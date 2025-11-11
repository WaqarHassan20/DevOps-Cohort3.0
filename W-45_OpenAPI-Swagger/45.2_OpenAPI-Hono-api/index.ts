import { z, createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

const app = new OpenAPIHono();

const SignupInput = z
  .object({
    email: z.string().openapi({ example: "example@gmail.com" }),
    password: z.string().openapi({ example: "Password@123" }),
  })
  .openapi("User credentials for signup");

const SignupOutput = z
  .object({
    message: z.string().openapi({ example: "User signed up successfully!" }),
  })
  .openapi("Signup response message");

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Hono OpenAPI Example",
  },
});

app.get("/ui", swaggerUI({ url: "/doc" }));

const signupRoute = createRoute({
  method: "post",
  path: "/signup",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SignupInput,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SignupOutput,
        },
      },
      description: "Successful signup",
    },
  },
});

app.openapi(signupRoute, async (c) => {
  const { email, password } = await c.req.json();
  return c.json({
    message: "User signed up successfully!",
    email: email,
    password: password,
  });
});


export default app;