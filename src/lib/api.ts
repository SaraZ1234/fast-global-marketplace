import { getStoredToken } from "./auth";

const API_URL = "http://localhost:3001";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getStoredToken();

  console.log("TOKEN FROM FRONTEND:", token);
  console.log("API REQUEST URL:", `${API_URL}${endpoint}`);

  console.log("TOKEN FROM FRONTEND:", token);

  const response = await fetch(`${API_URL}${endpoint}?_=${Date.now()}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  let data;

  console.log("RESPONSE STATUS:", response.status);
  console.log("RESPONSE URL:", response.url);

  const text = await response.text();

  console.log("RAW RESPONSE:", text);

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {
      message: text || "Invalid server response",
    };
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// export async function getMyOrders(){

//   const token = getStoredToken();

//   const res = await fetch(
//     `${API_URL}/order/my-orders`,
//     {
//       method:"GET",
//       headers:{
//         "Content-Type":"application/json",
//         Authorization:`Bearer ${token}`,
//       },
//     }
//   );

//   if(!res.ok){

//     const error = await res.json();
//     throw new Error(error.message || "Failed to fetch orders");

//   }

//   return res.json();

// }
