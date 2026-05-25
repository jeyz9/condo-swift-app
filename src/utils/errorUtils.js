export const extractErrorMessage = (error, fallbackMessage) => {
    const data = error?.response?.data;
  
    if (typeof data === "string") {
      return data;
    }
  
    if (data?.message && typeof data.message === "string") {
      return data.message;
    }
  
    if (Array.isArray(data?.errors)) {
      const messages = data.errors.filter((item) => typeof item === "string");
      if (messages.length) {
        return messages.join(", ");
      }
    }
  
    if (data && typeof data === "object") {
      const values = Object.values(data).filter((item) => typeof item === "string");
      if (values.length) {
        return values.join(", ");
      }
      try {
        const serialized = JSON.stringify(data);
        if (serialized !== "{}") return serialized;
      } catch {
      }
    }
  
    return error?.message || fallbackMessage;
  };
  