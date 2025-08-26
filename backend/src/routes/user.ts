import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";
import { decode, sign, verify } from "hono/jwt";
import { PrismaClientExtends } from "@prisma/client/extension";

export const  userRouter =new Hono <{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    }
}> ()

userRouter.post("/api/v1/user/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const data = await prisma.users.findUnique({
    where: {
      email: body.email,
    },
  });
  if (data) {
    return c.json({ message: "user already exist" });
  }

  const user = await prisma.users.create({
    data: {
      email: body.email,
      password: body.password,
    },
  });

  if (!user) {
    throw console.error("user is not created");
  }
  const token = await sign({ id: user.id }, c.env.JWT_SECRET);

  return c.json({ jwt: token, data: "user is created" });
});

userRouter.post("/api/v1/user/singin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.users.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  if (!user) {
    return c.json({ message: "user does not exit" });
  }
  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt: token });

  return c.text("signup routes");
});

