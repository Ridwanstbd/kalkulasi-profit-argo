import useDocumentHead from "../../hooks/useDocumentHead";

const Profile = () => {
  useDocumentHead({
    title: "Profil Saya",
    description: "Ini adalah bagian dari profil saya",
  });
  return (
    <>
      <div className="w-full bg-amber-300">MEEEE</div>
    </>
  );
};
export default Profile;
