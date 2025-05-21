export const submitRegistration = async (
  email: string,
  password: string,
  profile: string,
  preferences: string
) => {
  // Example payload
  const payload = {
    email,
    password,
    profile,
    preferences,
  };

  console.log("Submitting registration:", payload);
  // await fetch("/api/register", { method: "POST", body: JSON.stringify(payload) });
};
