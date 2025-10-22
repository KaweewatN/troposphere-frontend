import { Button, Image } from "../../components/ui";
import { signIn } from "../../entities/users";

export default function Signin() {
  const handleSignIn = () => {
    // Simply redirect to backend OAuth - no need for mutation
    signIn();
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col justify-center items-center space-y-5 px-5 py-5">
      <Image src="/images/static/signin-image.png" alt="Signin Illustration" />
      <div className="flex flex-col text-center space-y-5 @max-xs:w-3xs px-5">
        <h1 className="text-2xl text-theme-heading font-semibold">
          Borrow Equipments easily and quickly!
        </h1>
        <p className="text-theme-body">
          Borrow equipments easily and conveniently, with quick access anytime,
          anywhere.
        </p>
      </div>

      <Button onClick={handleSignIn} className="w-[90%] mt-5">
        Sign In to Borrow
      </Button>
    </div>
  );
}
