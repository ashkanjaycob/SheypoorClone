import api from "../configs/Api";

const addCategory = async (data) => {
    try {
        const response = await api.post("category", data);
        return response; // Assuming the response contains the added category data
    } catch (error) {
        // Handle errors here
        console.error("Error adding category:", error);
        throw error; // Re-throw the error for the caller to handle if needed
    }
}

const getCategory = async () => {
    try {
      const response = await api.get("category");
      return response.data;
    } catch (error) {
      console.error("Error while fetching profile:", error);
      throw error;
    }
  };

  const delCategory = async (id) => {
    try {
      const response = await api.get("category" , {id});
      return response.data;
    } catch (error) {
      console.error("Error while fetching profile:", error);
      throw error;
    }
  };

export { addCategory , getCategory , delCategory};
