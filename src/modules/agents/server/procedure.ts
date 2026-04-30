import { agents } from "@/db/schema";
import { db } from "@/index";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schemas";
import z from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { CarTaxiFront } from "lucide-react";

export const agentRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const [existingAgent] = await db
        .select({
          // TODO: Change to acutal count
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(eq(agents.id, input.id));
      return existingAgent;
    }),

  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);
    return data;
  }),
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdAgent;
    }),
});
