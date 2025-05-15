import { db } from "./app.js";
import { usersTable } from "./schema.js";
import { renderFile } from "ejs";
import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

export const usersRouter = new Hono();

usersRouter.get("/register", async (c) => {
    const rendered = await renderFile("views/register.html", { error: "" });

    return c.html(rendered);
});

usersRouter.post("/register", async (c) => {
    const form = await c.req.formData();
    const username = form.get("username");
    const password = form.get("password");

    const user = await createUser(username, password, "user");

    if (!user) {
        const rendered = await renderFile("views/register.html", { error: "Username already exists!!" });
        return c.html(rendered, 400);
    }

    setCookie(c, "token", user.token, { path: "/", httpOnly: true });

    return c.redirect("/");
});

usersRouter.get("/login", async (c) => {
    const rendered = await renderFile("views/login.html", { error: "" });

    return c.html(rendered);
});

usersRouter.post("/login", async (c) => {
    const form = await c.req.formData();
    const username = form.get("username");
    const password = form.get("password");

    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .get();

    if (!user) {
           const rendered = await renderFile("views/login.html", { error: "Invalid username!!" });
           return c.html(rendered, 401);
         }

    const hash = crypto
        .pbkdf2Sync(password, user.salt, 100000, 64, "sha512")
        .toString("hex");

    if (hash !== user.hashedPassword) {
        const rendered = await renderFile("views/login.html", { error: "Invalid password!!" });
        return c.html(rendered, 401);
    }

    setCookie(c, "token", user.token, { path: "/", httpOnly: true });

    return c.redirect("/");
});

usersRouter.get("/logout", (c) => {
    deleteCookie(c, "token");

    return c.redirect("/login");
});

export const createUser = async (username, password, role = "user") => {
    if (await db.select().from(usersTable).where(eq(usersTable.username, username)).get()) {
        return null;
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 100000, 64, "sha512")
        .toString("hex");
    const token = crypto.randomBytes(16).toString("hex");

    return await db
        .insert(usersTable)
        .values({
            username,
            hashedPassword,
            salt,
            token,
            role,
        })
        .returning()
        .get();
};

export const getUserByToken = async (token) => {
    if (!token) return null;

    return db
        .select()
        .from(usersTable)
        .where(eq(usersTable.token, token))
        .get();
};