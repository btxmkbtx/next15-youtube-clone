"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ClapperboardIcon, UserCircleIcon } from "lucide-react";

/**官方解释
 * SignedOut: https://clerk.com/docs/components/control/signed-out
 *  */
export const AuthButton = () => {
  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            {/* TODO: Add user profile menu button */}
            <UserButton.Link
              label="Studio"
              href="/studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
            />
            {/* 如果不写的话，clerk的UserButton会默认把manageAccount连接置顶 */}
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
        {/* Add menu items for Studio and User profile */}
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none [&_svg]:size-4"
          >
            <UserCircleIcon />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};
