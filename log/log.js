import axios from "axios";

const LOG_API = "http://20.244.56.144/evaluation-service/logs";
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiMjJjaTAzMEBraXRzdy5hYy5pbiIsImV4cCI6MTc1NzMxNDI4MCwiaWF0IjoxNzU3MzEzMzgwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzA0YzA5ODMtZGJmYy00OTYwLWI1NzItMTA5MzYxN2FjNTkzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic25laGEgbWFyYXBlbGx5Iiwic3ViIjoiODEwY2YzZjYtOTc2ZS00NTI0LWJlOTYtMzg1ODU5N2FlZDEzIn0sImVtYWlsIjoiYjIyY2kwMzBAa2l0c3cuYWMuaW4iLCJuYW1lIjoic25laGEgbWFyYXBlbGx5Iiwicm9sbE5vIjoiYjIyY2kwMzAiLCJhY2Nlc3NDb2RlIjoicXFRelprIiwiY2xpZW50SUQiOiI4MTBjZjNmNi05NzZlLTQ1MjQtYmU5Ni0zODU4NTk3YWVkMTMiLCJjbGllbnRTZWNyZXQiOiJ5VEFGZ0daYk1CUERRZXVGIn0.tRhKiP739ebDvGLx72aoOFmN0ZtKm0y5lrMlhLjUIK0"; // your full token

export async function Log(stack, level, pkg, message) {
  try {
    const response = await axios({
      method: "post",
      url: LOG_API,
      headers: {
        "Authorization": AUTH_TOKEN, // ✅ template literal
        "Content-Type": "application/json",
      },
      data: {
        stack,
        level,
        package: pkg,
        message,
      },
    });

    console.log("✅ Log sent:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("❌ Server responded with:", error.response.data);
    } else {
      console.error("❌ Failed to send log:", error.message);
    }
  }
}
// ...existing code...
Log("backend", "error", "handler", "received string, bool");
// ...existing code...