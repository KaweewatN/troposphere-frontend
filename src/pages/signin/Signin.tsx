import { Button, Image } from "../../components/ui";
import { signIn } from "../../entities/users";

export default function Signin() {
  const handleSignIn = () => {
    // Simply redirect to backend OAuth - no need for mutation
    signIn();
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col justify-center items-center space-y-5 px-5 py-10">
      <Image
        src="/images/static/signin-image.png"
        alt="Signin Illustration"
        height={400}
      />
      <div className="flex flex-col text-center space-y-5 @max-xs:w-3xs px-5">
        <h1 className="text-xl text-theme-heading font-semibold">
          SIIT Equipment Borrowing System
        </h1>
        <p className="text-theme-body text-sm">
          Borrow equipments easily and conveniently, with quick access anytime,
          anywhere.
        </p>
      </div>

      <Button onClick={handleSignIn} className="w-[90%] mt-5 font-medium">
        Sign In to Borrow
      </Button>

      <p className="text-theme-body text-sm mt-10">Powered by Troposphere</p>
    </div>
  );
}
