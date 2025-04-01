import useDocumentHead from "../hooks/useDocumentHead";

export function Index() {
  useDocumentHead({
    title: "Kalkulasi Bisnis UMKM",
    description: "Mudah Profit dengan Kalkulasi bisnis",
  });
  return (
    <div>
      <h1 className="text-5xl text-amber-800 ">Landing Page</h1>
    </div>
  );
}
export default Index;
