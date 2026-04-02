import { toast } from "sonner";

const nigerianPhoneRegex = /^(?:\+234|0)\d{10}$/;

export const registerFormValidation = (
  form: FormType,
  setErrors: (errors: FormType) => void,
  errors: FormType
) => {
  if (!form.name) {
    setErrors({ ...errors, name: "Name is required" });
    return false;
  }
  if (!form.email) {
    setErrors({ ...errors, email: "Email is required" });
    return false;
  }
  if (!form.phoneNumber) {
    setErrors({ ...errors, phoneNumber: "Phone number is required" });
    return false;
  }
  if (!nigerianPhoneRegex.test(form.phoneNumber.trim())) {
    setErrors({ ...errors, phoneNumber: "Use a valid Nigerian phone number" });
    return false;
  }
  if (!form.password) {
    setErrors({ ...errors, password: "Password is required" });
    return false;
  }
  if (form.password.length < 8) {
    setErrors({
      ...errors,
      password: "Password must be at least 8 characters",
    });
    return false;
  }

  return true;
};

export const loginFormValidation = (
  form: LoginFormTypes,
  setErrors: (errors: LoginFormTypes) => void,
  errors: LoginFormTypes
) => {
  if (!form.email) {
    setErrors({ ...errors, email: "Email is required" });
    return false;
  }
  if (!form.password) {
    setErrors({ ...errors, password: "Password is required" });
    return false;
  }
  if (form.password.length < 8) {
    setErrors({
      ...errors,
      password: "Password must be at least 8 characters",
    });
    return false;
  }
  return true;
};

export const vendorRegistrationFormValidation = (
  form: FormType,
  setErrors: (errors: FormType) => void,
  errors: FormType
) => {
  if (!form.name) {
    setErrors({ ...errors, name: "Full name is required" });
    return false;
  }
  if (!form.email) {
    setErrors({ ...errors, email: "Email is required" });
    return false;
  }
  if (!form.phoneNumber) {
    setErrors({ ...errors, phoneNumber: "Phone number is required" });
    return false;
  }
  if (!nigerianPhoneRegex.test(form.phoneNumber.trim())) {
    setErrors({ ...errors, phoneNumber: "Use a valid Nigerian phone number" });
    return false;
  }
  if (!form.merchantType) {
    setErrors({ ...errors, merchantType: "Merchant type is required" });
    return false;
  }
  if (!form.password) {
    setErrors({ ...errors, password: "Password is required" });
    return false;
  }
  if (form.password.length < 8) {
    setErrors({
      ...errors,
      password: "Password must be at least 8 characters",
    });
    return false;
  }
  if (form.isBusinessRegistered === "true" && !form.cacDocument) {
    toast.error("CAC document is required for registered businesses");
    return false;
  }
  return true;
};
