export const checkPasswordStrength = (password) => {
  const requirements = [
    { label: "More than 6 characters", valid: password.length > 6, id: "length" },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(password), id: "upper" },
    { label: "At least one lowercase letter", valid: /[a-z]/.test(password), id: "lower" },
    { label: "At least one number", valid: /[0-9]/.test(password), id: "number" },
    { label: "At least one special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password), id: "special" },
  ];

  const isValid = requirements.every((req) => req.valid);

  return { requirements, isValid };
};
