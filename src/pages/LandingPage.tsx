import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  //bugged
  if (isSignedIn) {
    navigate("/home");
  }

  return (
    <div className="flex gap-2">
      <SignUpButton mode="modal" />
      <SignInButton mode="modal" />
    </div>
  );
};

export default LandingPage;
