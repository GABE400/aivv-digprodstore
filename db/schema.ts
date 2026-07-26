import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

// Better Auth Schema + Roles & Onboarding for AIVV Store

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"), // 'user' | 'admin'
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  acceptedTerms: boolean("accepted_terms").notNull().default(false),
  acceptedTermsAt: timestamp("accepted_terms_at"),
  preferredFormat: text("preferred_format").default("Browser"), // 'Browser' | 'EPUB' | 'PDF'
  favoriteGenres: text("favorite_genres"), fontScale: integer("font_scale").default(18),
  ownedBooks: text("owned_books").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const book = pgTable("book", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  author: text("author").notNull(),
  authorRole: text("author_role"),
  price: text("price").notNull(),
  originalPrice: text("original_price"),
  discountPercent: integer("discount_percent"),
  dodoProductId: text("dodo_product_id"),
  rating: text("rating").default("5.0"),
  reviewsCount: integer("reviews_count").default(1),
  pages: integer("pages").default(250),
  readingTime: text("reading_time").default("5 hrs"),
  category: text("category").notNull(),
  tags: text("tags"),
  badge: text("badge"),
  formats: text("formats").default("PDF,EPUB"),
  pdfUrl: text("pdf_url"),
  epubUrl: text("epub_url"),
  coverUrl: text("cover_url"),
  bgGradient: text("bg_gradient"),
  accentColor: text("accent_color"),
  textColor: text("text_color"),
  pattern: text("pattern"),
  synopsis: text("synopsis").notNull(),
  sampleChapters: text("sample_chapters"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

