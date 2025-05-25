export const submitRegistration = async (
  email: string,
  password: string,
  profile: string,
  preferences: string
) => {
  const payload = {
    email,
    password,
    profile,
    preferences,
  };

  console.log("Submitting registration:", payload);
};
