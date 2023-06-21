import { useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="flex items-center  fixed top-0 shadow w-full justify-between px-4 md:px-10 py-4   z-10 bg-white ">
      <div>
        <h3 className="font-bold text-2xl ">ConferX</h3>
      </div>
      <div className="flex items-center gap-3 font-semibold  ">
        {user.firstName}.{user?.lastName?.substring(0, 1)}
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9",
              userButtonPopoverCard: "font-nunito",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
