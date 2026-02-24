import { relations } from "drizzle-orm";import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
  jsonb,
  real,
  serial,
  decimal,
  date,
  smallint,
  bigint,
  primaryKey,
} from "drizzle-orm/pg-core";

const posts = pgTable("Post", {
  id: text("id")
    .primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});


const postAttachments = pgTable("PostAttachment", {
  id: text("id")
    .primaryKey(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  size: integer("size"),
  filename: text("filename"),
  postId: text("postId"),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

const postAttachmentsRelations = relations(
  postAttachments,
  (helpers) => ({
    post: helpers.one(posts, {
      relationName: "PostToPostAttachment",
      fields: [postAttachments.postId],
      references: [posts.id],
    }),
  }),
);

const postsRelations = relations(posts, (helpers) => ({
  
  attachments: helpers.many(postAttachments, {
    relationName: "PostToPostAttachment",
  }),
}));



export const schema = {
  posts,
  postAttachments,
  postAttachmentsRelations,
  postsRelations
}