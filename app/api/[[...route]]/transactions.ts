import { Hono } from "hono";
import { db1 } from "@/db/drizzle";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { subDays, parse } from "date-fns";
import {
  transactions,
  categories,
  accounts,
  insertTransactionSchema,
} from "@/db/schema";
import { eq, inArray, and, gte, lte, desc, sql } from "drizzle-orm";
import { currentUser } from "@/lib/custom-auth"; 

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (c) => {
      const user = await currentUser()

      if (!user?.id) {
        throw new HTTPException(401, {
          res: c.json({ message: "Unauthorized!" }, 401),
        });
      }
      
      const { from, to, accountId } = c.req.valid("query");

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 90);

      const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const data = await db1
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, user?.id),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));
      return c.json({ data });
    }
  )
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
          id: transactions.id,
          date: transactions.date,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, user?.id)));
      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ message: "Transaction not found" }, 404),
        });
      }
      return c.json({ data });
    }
  )
  .post(
    "/",
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    async (c) => {
      const user = await currentUser()

      if (!user?.id) {
        throw new HTTPException(401, {
          res: c.json({ message: "Unauthorized!" }, 401),
        });
      }
      const values = c.req.valid("json");

      const [data] = await db1
        .insert(transactions)
        .values({ id: createId(), ...values })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-create",
    zValidator("json", z.array(insertTransactionSchema.omit({ id: true }))),
    async (c) => {
      const user = await currentUser()

      if (!user?.id) {
        throw new HTTPException(401, {
          res: c.json({ message: "Unauthorized!" }, 401),
        });
      } 

      const values = c.req.valid("json");
      const data = await db1
        .insert(transactions)
        .values(values.map((value) => ({ id: createId(), ...value })))
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
       
      const transactionsToDelete = db1.$with("transactions_to_delete").as(
        db1
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(inArray(transactions.id, ids), eq(accounts.userId, user?.id))
          )
      );

      const data = await db1
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )
        .returning({
          id: transactions.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", insertTransactionSchema.omit({ id: true })),
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

      const transactionToUpdate = db1.$with("transaction_to_update").as(
        db1
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, user?.id)))
      );

      const [data] = await db1
        .with(transactionToUpdate)
        .update(transactions)
        .set(values)
        .where(
          eq(transactions.id, sql`(select id from ${transactionToUpdate})`)  // inArray(transactions.id, sql`(select id from ${transactionToUpdate})`)
        )
        .returning();

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ message: "Transaction not Found!" }, 404),
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

      const transactionToDelete = db1.$with("transaction_to_delete").as(
        db1
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, user?.id)))
      );

      const [data] = await db1
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          eq(transactions.id, sql`(select id from ${transactionToDelete})`) // inArray(transactions.id, sql`(select id from ${transactionToUpdate})`)
        )
        .returning();
      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ message: "Transaction not Found!" }, 404),
        });
      }
      return c.json({ data });
    }
  );

export default app;