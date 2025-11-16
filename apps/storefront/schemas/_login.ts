import * as Yup from "yup";

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .max(100, "Email must be at most 100 characters")
    .required("Email is required"),

  password: Yup.string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must be at most 64 characters")
    .required("Password is required"),
});

export default loginSchema;
