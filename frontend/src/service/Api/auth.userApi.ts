import { privateAxios , publicAxios } from "../axiosInstance/userInstance";


const handleResponse = (response: any, message: string) => {
  if (!response) console.error(message);
  return response;
};

const handleError = (error: any) => {
  console.error(error);
  throw error;
};

export const signUpRequest = async (formData:object)=>{
    try {
        const response = await publicAxios.post("/user/signUp", formData)
        return handleResponse(response,"Error in sign-up request")
    } catch (error) {
        handleError(error)
    }
}

export const signInRequest = async (formData: object) => {
  try {
    const response = await publicAxios.post("/user/signIn", formData);
    console.log('signInRequest------')
    return handleResponse(response, "Error in sign-in request");
  } catch (error) {
    handleError(error);
  }
};

