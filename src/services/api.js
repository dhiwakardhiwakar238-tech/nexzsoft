const API_URL = "http://127.0.0.1:8000";

// LOGIN API
export const loginUser = async (
  email,
  password
) => {
  try {
    const response = await fetch(
      `${API_URL}/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data =
      await response.json();

    return data;
  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return null;
  }
};

// SIGNUP API
export const signupUser =
  async (form) => {
    try {
      const response =
        await fetch(
          `${API_URL}/signup`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: form.name,

              company_name:
                form.company_name,

              whatsapp_number:
                form.code +
                form.whatsapp,

              email: form.email,

              password:
                form.password,
            }),
          }
        );

      const data =
        await response.json();

      return data;
    } catch (error) {
      console.error(
        "Signup Error:",
        error
      );

      return null;
    }
  };