import dynamic from "next/dynamic";
const TShirtEditor = dynamic(() => import("@/components/TShirtEditor"));

const HomePage = () => {
  const urls = [
    {
      id: 0,
      url: "/images/Oversized-Lavender-Back-removebg-preview.png",
    },
    {
      id: 1,
      url: "https://www.transparentpng.com/download/shirt/t0nf0S-t-shirt-transparent-background.png",
    },
  ];
  return (
    <main className="h-screen w-screen">
      <TShirtEditor imageUrls={urls} />
    </main>
  );
};

export default HomePage;
