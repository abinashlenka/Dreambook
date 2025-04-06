// // import { URL, responseValidator, apiError, getAuthToken } from "./helper";

// // export const getAllAuthors = async () => {
// //   const myHeaders = new Headers();
// //   myHeaders.append("Authorization", `Bearer ${await getAuthToken()}`);

// //   const requestOptions = {
// //     method: "GET",
// //     headers: myHeaders,
// //     redirect: "follow",
// //   };

// //   try {
// //     const response = await fetch(`${URL}/users?role=author`, requestOptions);
// //     return responseValidator(response);
// //   } catch (e) {
// //     return apiError(e);
// //   }
// // };
// // export const addAuthor = async ({ name, email, password }) => {
// //   const myHeaders = new Headers();
// //   myHeaders.append("Authorization", `Bearer ${await getAuthToken()}`);

// //   const formData = new FormData();
// //   formData.append("name", name);
// //   formData.append("email", email);
// //   formData.append("password", password);
// //   formData.append("role", "author"); // Assuming you want to create an author role

// //   const requestOptions = {
// //     method: "POST",
// //     headers: myHeaders,
// //     body: formData,
// //     redirect: "follow",
// //   };

// //   try {
// //     const response = await fetch(`${URL}/users`, requestOptions);
// //     return responseValidator(response);
// //   } catch (e) {
// //     return apiError(e);
// //   }
// // };
// import { URL, responseValidator, apiError, getAuthToken } from "./helper";

// // ✅ GET all authors
// export const getAllAuthors = async () => {
//   const myHeaders = new Headers();
//   myHeaders.append("Authorization", `Bearer ${await getAuthToken()}`);

//   const requestOptions = {
//     method: "GET",
//     headers: myHeaders,
//     redirect: "follow",
//   };

//   try {
//     const response = await fetch(`${URL}/users?role=author`, requestOptions);
//     return responseValidator(response);
//   } catch (e) {
//     return apiError(e);
//   }
// };

// // ✅ ADD new author (correct route: /users/register)
// export const addAuthor = async ({ name, email, password }) => {
//   try {
//     const token = await getAuthToken();
//     const myHeaders = new Headers();
//     myHeaders.append("Authorization", `Bearer ${token}`);

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("password", password);
//     formData.append("role", "author");

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: formData,
//       redirect: "follow",
//     };

//     const url = `${URL}/users/register`; // ✅ This is the correct backend route
//     console.log("📡 Calling API:", url);

//     const response = await fetch(url, requestOptions);
//     const json = await response.json();
//     console.log("🔍 Raw API JSON:", json);

//     return responseValidator(response, true, "Author Added Successfully");
//   } catch (e) {
//     console.error("❌ API Error in addAuthor:", e);
//     return apiError(e);
//   }
// };
import { appendQueryParams } from "../server-apis/helper";
import { URL, responseValidator, apiError, getAuthToken } from "./helper";
export const getAllAuthors = async (payload) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${await getAuthToken()}`);
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try{
        const response = await fetch(URL+`/users${appendQueryParams(payload)}`, requestOptions);
        return responseValidator(response);
    }
    catch(e){
        return apiError(e);
    }
}
export const getSingleAuthor = async (id) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${await getAuthToken()}`);
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try{
        const response = await fetch(URL+`/users/${id}`, requestOptions);
        return responseValidator(response);
    }
    catch(e){
        return apiError(e);
    }
}

export const addAuthor = async (payload) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${await getAuthToken()}`);
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(payload);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    try{
        const response = await fetch(URL+"/auth/add-author", requestOptions)
        return responseValidator(response, true)
    }
    catch(e){
        return apiError(e)
    }
}

export const editAuthor = async (payload, id) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${await getAuthToken()}`);
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(payload);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    try{
        const response = await fetch(URL+`/users/author/${id}`, requestOptions)
        return responseValidator(response, true)
    }
    catch(e){
        return apiError(e)
    }
}