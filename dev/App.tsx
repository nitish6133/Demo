import React from "react";
import { Login } from "../src";

function App() {
  const handleLoginSuccess = (user: any) => {
    console.log("Login successful:", user);
    alert(`Welcome ${user.username}!`);
  };

  return (
    <div>
      <Login
        backendUrl="http://localhost:8080"
        onSuccess={handleLoginSuccess}
        theme={{
          primaryColor: "#10B981",
          backgroundColor: "#F0FDF4",
          fontFamily: "Inter, sans-serif"
        }}
      />
    </div>
  );
}

export default App;