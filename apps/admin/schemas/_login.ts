import * as Yup from "yup";

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Unesite valjanu email adresu")
    .max(100, "Email može imati najviše 100 znakova")
    .required("Email je obavezan"),

  password: Yup.string()
    .trim()
    .min(6, "Lozinka mora imati najmanje 6 znakova")
    .max(64, "Lozinka može imati najviše 64 znaka")
    .required("Lozinka je obavezna"),
});

export default loginSchema;
