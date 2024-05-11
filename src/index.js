import userRoute from "./routes/user.js";
import blogRoute from "./routes/blog.js";

export const all_Routes_function = (app) => {
  app.use("/user", userRoute);
  app.use("/blog", blogRoute);
};
