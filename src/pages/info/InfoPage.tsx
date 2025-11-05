import useAuthStore from "@/store/authStore";

export default function InfoPage() {
  const { toggleModal } = useAuthStore();

  return (
    <div className="h-full w-full">
      <p>Info Page</p>
      <button onClick={toggleModal}>Click here to login</button>
    </div>
  );
}
