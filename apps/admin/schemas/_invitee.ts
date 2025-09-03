import * as Yup from "yup";

export const inviteeSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "Ime mora imati barem 2 znaka")
    .max(50, "Ime ne smije biti dulje od 50 znakova")
    .required("Ime je obavezno"),
  lastName: Yup.string()
    .min(2, "Prezime mora imati barem 2 znaka")
    .max(50, "Prezime ne smije biti dulje od 50 znakova")
    .required("Prezime je obavezno"),
  phone: Yup.string()
    .matches(/^\+?[0-9]{7,15}$/, "Unesite ispravan broj mobitela")
    .nullable(),
  email: Yup.string().email("Unesite ispravan email").nullable(),
  tag: Yup.string().max(30).nullable(),
});

export type CreateInviteeDto = Yup.InferType<typeof inviteeSchema>;
