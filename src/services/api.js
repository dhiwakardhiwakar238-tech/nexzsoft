// Temporary Mock API Service

// Login API
export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        email === "admin@nexzsoft.com" &&
        password === "123456"
      ) {
        resolve({
          success: true,
          token: "mock-jwt-token",
          user: {
            id: 1,
            name: "Dhiwakar",
            email: "admin@nexzsoft.com",
            role: "admin",
          },
        });
      } else {
        reject({
          success: false,
          message: "Invalid credentials",
        });
      }
    }, 1000);
  });
};

// Profile API
export const getProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "Dhiwakar",
        email: "admin@nexzsoft.com",
        company: "Nexzsoft",
        phone: "+91 9876543210",
      });
    }, 1000);
  });
};

// Analytics API
export const getAnalytics = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalMessages: 12450,
        customers: 1250,
        accuracy: "98%",
        automation: "24/7",
      });
    }, 1000);
  });
};

// Contacts API
export const getContacts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Arun",
          phone: "+91 9876543210",
        },
        {
          id: 2,
          name: "Kumar",
          phone: "+91 9876501234",
        },
        {
          id: 3,
          name: "Priya",
          phone: "+91 9876549999",
        },
      ]);
    }, 1000);
  });
};

// WhatsApp API
export const getWhatsAppStatus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        connected: false,
        qr: "QR_CODE_PLACEHOLDER",
      });
    }, 1000);
  });
};

// PDF Upload API
export const uploadPDF = async (file) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (file) {
        resolve({
          success: true,
          fileName: file.name,
        });
      } else {
        reject({
          success: false,
          message: "No file selected",
        });
      }
    }, 2000);
  });
};

// Signup API
export const signupUser = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Signup successful",
        user: {
          id: Date.now(),
          ...userData,
        },
      });
    }, 1000);
  });
};