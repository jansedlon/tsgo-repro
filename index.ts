import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";

export const userSubscriptionProductV2S = pgTable("UserSubscriptionProductV2", {
  id: text("id")
    .primaryKey(),
  cancelledAt: timestamp("cancelledAt", { mode: "date", precision: 3 }),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  status: text("status").$type<"active" | "trialing">().notNull(),
  quantity: integer("quantity"),
  currentPeriodStart: timestamp("currentPeriodStart", {
    mode: "date",
    precision: 3,
  }).notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd", {
    mode: "date",
    precision: 3,
  }).notNull(),
  failedPaymentNotificationSentAt: timestamp(
    "failedPaymentNotificationSentAt",
    { mode: "date", precision: 3 },
  ),
  downgradeToPriceId: text("downgradeToPriceId"),
  userId: text("userId").notNull(),
  subscriptionProductId: text("subscriptionProductId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});


const schema = {
    userSubscriptionProductV2S,
};

const db = drizzle("", { schema });

type Subscription = {
    id: string;
}

const stripeInvoice: { subscription: string | Subscription } = { subscription: "dflkjd"}

const subscriptionProduct = db.query.userSubscriptionProductV2S.findFirst({
    where(fields, { eq }) {
        const subscriptionId =
            typeof stripeInvoice.subscription === "string"
            ? stripeInvoice.subscription
            : stripeInvoice.subscription!.id;

        return eq(fields.stripeSubscriptionId, subscriptionId);
    },
    columns: {
        id: true,
        currentPeriodStart: true,
    },
});