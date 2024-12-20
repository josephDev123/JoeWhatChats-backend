import Joi from "joi";

export const registercredentialValidation = async (
  username: string,
  name: string,
  email: string,
  password: string
) => {
  try {
    const schema = Joi.object({
      name: Joi.string()

        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z\s]+$/)
        .trim()
        .required(),
      password: Joi.string()
        // .min(6)
        // .max(10)
        // .pattern(
        //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        // )
        // .message(
        //   "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
        // )
        .required(),
      email: Joi.string()
        // .email() //{ tlds: { allow: false } }
        .required(),
      username: Joi.string().min(5).max(10),
    });

    return schema.validate({ name, password, email, username });
  } catch (error) {
    throw new Error("Validation error: " + (error as Error).message);
  }
};

export const loginCredentialValidation = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const schema = Joi.object({
      password: Joi.string()
        // .min(6)
        // .max(10)
        // .pattern(
        //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        // )
        // .message(
        //   "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
        // )

        .required(),
      email: Joi.string()
        // .email() //{ tlds: { allow: false } }
        .required(),
      username: Joi.string().min(5).max(10),
    });

    return schema.validate({ password, email, username });
  } catch (error) {
    throw new Error("Validation error: " + (error as Error).message);
  }
};
