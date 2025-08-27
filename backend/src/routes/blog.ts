import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";
import { decode, sign, verify } from "hono/jwt";
import { PrismaClientExtends } from "@prisma/client/extension";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    auth: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const token: string = c.req.header("Authorization") || "";
  if (!token) {
    return c.json({ message: "does not containet toeken" });
  }

  try {
    type decodedToken_ = {
      id: string;
    };
    const decodedToken = (await verify(
      token,
      c.env.JWT_SECRET
    )) as decodedToken_;

    c.set("auth", decodedToken.id);

    await next();
  } catch (error) {
    return c.json("unAuthorize");
  }
});

//   id String @id @default(uuid())
//   content String
//   title String
//   publish Boolean @default(false)
//   author users @relation(fields: [authorId] ,references: [id])
//   authorId String



// ? CREATE BLOG ROUTE
blogRouter.post("/blog", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const id = c.get("auth");
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: id,
    },
  });
  if (!post) {
    c.status(400);
    return c.json("blog is not created");
  }
  c.status(200);

  return c.json({ message: "blog is created", id: post?.id });
});


// ? UPDATE BLOG ROUTE
blogRouter.put("/blog", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const respons = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      content: body.content,
      title: body.title,
    },
  });
  c.status(200);
  return c.json({ message: "blog is created", id: respons.id });
});
blogRouter.get("/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const data = await prisma.post.findMany();

    if (!data) {
      c.status(401);
      return c.json({
        message: "something wen wrong",
      });
    }
    c.status(200);
    return c.json(data);
  } catch (error) {
    return c.json({ message: error });
  }
});

//? SPECIFI BLOG 


blogRouter.get("/blog/:id", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const id = c.req.param("id");

    const respons = await prisma.post.findFirst({
      where: {
        id,
      },
    });
    c.status(200);
    return c.json({respons});
  } catch (error) {
    return c.json({ error, message: "error whie fetching the blog post" });
  }
});


