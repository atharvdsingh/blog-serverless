import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";
import { decode, sign, verify } from "hono/jwt";
import { PrismaClientExtends } from "@prisma/client/extension";

export const blogRouter= new Hono
<{Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
}}>
()



blogRouter.use("/api/v1/blog/*", async (c, next) => {
  const token: string = c.req.header("Authorization") || "";
  if (token) {
    return c.json({ message: "does not containet toeken" });
    await next();
  }

  try {
    type decodedToken_ = {
      id: string;
    };
    const respons = (await verify(token, c.env.JWT_SECRET)) as decodedToken_;
    if (!respons.id) {
      return c.json("unAuthorize");
      await next()
    }

    next();
  } catch (error) {}
});

blogRouter.post("/blog", (c) => {
  return c.text("create blog");
});
blogRouter.put("/blog", (c) => {
  return c.text("update blog");
});
blogRouter.get("/blog", (c) => {
  return c.text("get all the blogs");
});
blogRouter.get("blog/:id", (c) => {
  const id = c.req.param;

  console.log(id);

  return c.text("get the specific blog");
});