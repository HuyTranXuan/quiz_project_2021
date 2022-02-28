const restrictedPaths = ["/questions", "/quiz", "/statistics"];
import { renderFile } from "../deps.js";

const authMiddleware = async (context, next) => {
  const user = await context.state.session.get("user");
  const data = {validationErrors:"Please login to use this feature."};
  if (
    !user &&
    restrictedPaths.some((path) =>
      context.request.url.pathname.startsWith(path)
    )
  ) {
    //context.response.redirect("/auth/login");
    context.response.body = await renderFile("login.eta", data);
  } else {
    await next();
  }
};
export { authMiddleware };
