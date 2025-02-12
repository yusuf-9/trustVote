import { useCallback, useState } from "react";

import useRequestHandler from "@/client/common/hooks/use-fetch-handler";
import { useRouter } from "next/navigation";

type ValidationErrorsType = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function useRegisterForm() {
  const router = useRouter();
  const { loading, error, handleRequest } = useRequestHandler();

  const [name, setName] = useState("test");
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("12345678");
  const [confirmPassword, setConfirmPassword] = useState("12345678");

  const [validationErrors, setValidationErrors] = useState<ValidationErrorsType>({});

  // Input sanitization utility
  const sanitizeInput = useCallback((value: string, type: "name" | "email" | "password") => {
    switch (type) {
      case "name":
        // Allow only letters and spaces, trim extra whitespace
        return value.replace(/[^a-zA-Z\s]/g, "").trim();
      case "email":
        // Trim extra whitespace
        return value.trim();
      case "password":
        // Trim leading and trailing whitespace
        return value.trim();
      default:
        return value;
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrorsType = {};

    const sanitizedName = sanitizeInput(name, "name");
    const sanitizedEmail = sanitizeInput(email, "email");
    const sanitizedPassword = sanitizeInput(password, "password");

    if (!sanitizedName) newErrors.name = "Name is required";
    else if (sanitizedName.length < 3) newErrors.name = "Name must be at least 3 characters";

    if (!sanitizedEmail) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(sanitizedEmail)) newErrors.email = "Email is invalid";

    if (!sanitizedPassword) newErrors.password = "Password is required";
    else if (sanitizedPassword.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (sanitizedPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setValidationErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [name, email, password, confirmPassword, sanitizeInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const sanitizedData = {
      name: sanitizeInput(name, "name"),
      email: sanitizeInput(email, "email"),
      password: sanitizeInput(password, "password"),
    };

    try {
      await handleRequest(
        "/auth/register",
        "post",
        () => {
          router.push("/auth/verification?email=" + encodeURIComponent(sanitizedData.email));
        },
        sanitizedData
      );
    } catch (error) {
      console.error({ error });
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    validationErrors,
    handleSubmit,
    isSubmitting: loading,
    registrationError: error,
  };
}
