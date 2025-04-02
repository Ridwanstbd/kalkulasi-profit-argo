import useDocumentHead from "../hooks/useDocumentHead";

export function Index() {
  useDocumentHead({
    title: "Kalkulasi Profit",
    description: "Mudah Profit dengan Kalkulasi profit",
  });
  return (
    <div>
      <h1 className="text-5xl text-amber-800 ">Landing Page</h1>
    </div>
  );
}
export default Index;
