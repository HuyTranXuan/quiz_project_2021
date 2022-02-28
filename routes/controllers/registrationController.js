import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";
import { validasaur } from "../../deps.js";

const registerValidationRules = {
  email: [validasaur.required, validasaur.minLength(4)],
  password: [validasaur.required, validasaur.minLength(4)],
  repassword: [validasaur.required, validasaur.minLength(4)],
};

const registerUser = async ({ request, response, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  const registerData = {
    email: params.get("email"),
    password: params.get("password"),
    repassword: params.get("repassword"),
  };

  const [passes, errors] = await validasaur.validate(
    registerData,
    registerValidationRules,
  );

  if (!passes) {
    registerData.validationErrors = errors;
    render("registration.eta", registerData);
  } else {
    const notAllowList = await userService.findUserByEmail(registerData.email);
    if (notAllowList && notAllowList.length > 0) {
      registerData.validationErrors = {
        error: {
          error: "Email address not available, please choose another one.",
        },
      };
      render("registration.eta", registerData);
    } else if (registerData.password != registerData.repassword) {
      registerData.validationErrors = {
        error: {
          error: "Confirm password does not match!",
        },
      };
      render("registration.eta", registerData);
    }

     else {
      await userService.addUser(
        registerData.email,
        await bcrypt.hash(registerData.password),
      );

      // response.redirect("/auth/login");
      render("login.eta", {
        validationErrors:
          "Successfully Register!",
      });
      return;
    }
  }
};

const showRegistrationForm = ({ render }) => {
  render("registration.eta");
};

export { registerUser, showRegistrationForm };
