import dynamic from "next/dynamic";
const TShirtEditor = dynamic(() => import("@/components/TShirtEditor"));

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
