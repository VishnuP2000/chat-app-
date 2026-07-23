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
      console.log("signUpRequest",formData)
        const response = await publicAxios.post("/user/signUp", formData)
        console.log('resp',response)
        return handleResponse(response,"Error in sign-up request")
    } catch (error) {
      console.log('signUp error',error)
        handleError(error)
    }
}

export const signInRequest = async (formData: object) => {
  try {
    console.log('formdata',formData)
    const response = await publicAxios.post("/user/signIn", formData);
    console.log('signInRequest------',response)
    return handleResponse(response, "Error in sign-in request");
    // return response.data;
  } catch (error) {
    console.log('errror',error)
    handleError(error);
  }
};

