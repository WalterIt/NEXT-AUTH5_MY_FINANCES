import { db1 } from "@/db/drizzle";
import { Hono } from "hono";
import { eq, inArray, and } from "drizzle-orm";
import { categories, insertCategorySchema } from "@/db/schema";
import { currentUser } from "@/lib/custom-auth"; 
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

const app = new Hono()
  .get("/",  async (c) => {
    const user = await currentUser()

      if (!user?.id) {
        throw new HTTPException(401, {
          res: c.json({ message: "Unauthorized!" }, 401),
        });
      }

    const data = await db1
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.userId, user?.id));
    return c.json({ data });
  })
  .get(
    "/:id",
    
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = await currentUser()

      if (!user?.id) {
        throw new HTTPException(401, {
          res: c.json({ message: "Unauthorized!" }, 401),
        });
      }

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({ error: "Invalid id" }, 400),
        });
      }
      const [data] = await db1
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(and(eq(categories.id, id), eq(categories.userId, user?.id)));
      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ message: "Category not found" }, 404),
        });
      }
      return c.json({ data });
    }
  )
  .post(
    "/",
    
    zValidator("json", insertCategorySchema.pick({ name: true })),
    async (c) => {
      const user = await currentUser()

      if (!user?.id) {
        throw new HTTPException(401, {
          res: c.json({ message: "Unauthorized!" }, 401),
        });
      }

      const values = c.req.valid("json");
      const [data] = await db1
        .insert(categories)
        .values({ id: createId(), userId: user?.id, ...values })
        .returning();
      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const user = await currentUser()

      if (!user?.id) {
        throw new HTTPException(401, {
          res: c.json({ message: "Unauthorized!" }, 401),
        });
      }

      const { ids } = c.req.valid("json");
      if (!ids) {
        throw new HTTPException(400, {
          res: c.json({ error: "Invalid ids" }, 400),
        });
      }
      const data = await db1
        .delete(categories)
        .where(
          and(inArray(categories.id, ids), eq(categories.userId, user?.id))
        )
        .returning({
          id: categories.id,
        });
      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", insertCategorySchema.pick({ name: true })),
    async (c) => {
      const user = await currentUser()

      if (!user?.id) {
        throw new HTTPException(401, {
          res: c.json({ message: "Unauthorized!" }, 401),
        });
      }

      const { id } = c.req.valid("param");
      if (!id) {
        throw new HTTPException(400, {
          res: c.json({ error: "Invalid id" }, 400),
        });
      }
      const values = c.req.valid("json");

      const [data] = await db1
        .update(categories)
        .set(values)
        .where(and(eq(categories.id, id), eq(categories.userId, user?.id)))
        .returning();
      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ message: "Category not found" }, 404),
        });
      }
      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const user = await currentUser()

      if (!user?.id) {
        throw new HTTPException(401, {
          res: c.json({ message: "Unauthorized!" }, 401),
        });
      }
      
      const { id } = c.req.valid("param");
      if (!id) {
        throw new HTTPException(400, {
          res: c.json({ error: "Invalid id" }, 400),
        });
      }
      const [data] = await db1
        .delete(categories)
        .where(and(eq(categories.id, id), eq(categories.userId, user?.id)))
        .returning();
      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ message: "Category not found" }, 404),
        });
      }
      return c.json({ data });
    }
  );

export default app;