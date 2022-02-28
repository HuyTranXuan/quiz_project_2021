const restrictedPaths = ["/questions", "/quiz", "/statistics"];
import { renderFile } from "../deps.js";

const authMiddleware = async (context, next) => {
  const user = await context.state.session.get("user");
  if (
    !user &&
    restrictedPaths.some((path) =>
      context.request.url.pathname.startsWith(path)
    )
  ) {
    //context.response.redirect("/auth/login");
    let feature = context.request.url.pathname.replace('/', '')
    feature = feature.charAt(0).toUpperCase() + feature.slice(1);
    const data = {validationErrors: `Please login to use the ${feature} feature.`};
    context.response.body = await renderFile("login.eta", data);
  } else {
    await next();
  }
};
export { authMiddleware };
