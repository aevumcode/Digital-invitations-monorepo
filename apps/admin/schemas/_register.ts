import * as Yup from "yup";

const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Ime i prezime moraju imati najmanje 2 znaka")
    .max(50, "Ime i prezime mogu imati najviše 50 znakova")
    .required("Ime i prezime su obavezni"),

  email: Yup.string()
    .trim()
    .email("Unesite valjanu email adresu")
    .max(100, "Email može imati najviše 100 znakova")
    .required("Email je obavezan"),

  password: Yup.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova")
    .max(64, "Lozinka može imati najviše 64 znaka")
    .matches(/[a-z]/, "Lozinka mora sadržavati barem jedno malo slovo")
    .matches(/[A-Z]/, "Lozinka mora sadržavati barem jedno veliko slovo")
    .matches(/[0-9]/, "Lozinka mora sadržavati barem jedan broj")
    .matches(/[^a-zA-Z0-9]/, "Lozinka mora sadržavati barem jedan poseban znak")
    .required("Lozinka je obavezna"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Lozinke se ne podudaraju")
    .required("Potvrda lozinke je obavezna"),
});

export default registerSchema;
