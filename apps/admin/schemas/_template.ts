import * as Yup from "yup";

const templateSchema = Yup.object({
  title: Yup.string().min(3).max(80).required("Project title is required"),
  groomName: Yup.string().min(2).max(40).required("Groom name is required"),
  brideName: Yup.string().min(2).max(40).required("Bride name is required"),
  date: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .required("Date is required"),
  time: Yup.string()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm")
    .required("Time is required"),
  venue: Yup.string().min(2).max(80).required("Venue is required"),
  city: Yup.string().min(2).max(60).required("City is required"),
  message: Yup.string()
    .min(10)
    .max(160, "Keep it short for WhatsApp")
    .required("Message is required"),
  heroImage: Yup.string().url("Enter a valid URL").nullable(),
});

export { templateSchema };
