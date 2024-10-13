import TShirtEditor from "@/components/TShirtEditor";
import React from "react";

const HomePage = () => {
  const urls = [
    "https://crunkthread.com/wp-content/uploads/2022/05/Oversized-Lavender-Back.jpg",
    "https://www.transparentpng.com/download/shirt/t0nf0S-t-shirt-transparent-background.png",
  ];
  return (
    <main className="h-screen w-screen">
      <TShirtEditor imageUrls={urls} />
    </main>
  );
};

export default HomePage;
