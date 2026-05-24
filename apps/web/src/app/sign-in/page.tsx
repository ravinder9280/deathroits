"use client";
import { Button } from "@monorepo/ui/components/button";
import { Input } from "@monorepo/ui/components/input";
import { Label } from "@monorepo/ui/components/label";
import Image from "next/image";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
export default function Page() {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {




    const { data, error } = await authClient.signIn.social({
      callbackURL: process.env.NEXT_PUBLIC_URL+"/tournaments",

      provider: "google",

      fetchOptions: {
        onRequest: () => {
          setLoading(true)

        },
       


      }

    })
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return;
    }

  }
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center ">
      <div className="max-w-[450px] w-full px-2">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-xl font-bold text-center">
            Sign In to Deathroit
          </h2>
        </div>

        <div className="bg-custom-dark flex flex-col gap-6 rounded-xl md:rounded-3xl p-6 md:p-10 ">
          <div>
            <div className="mb-4">
              <Label className="">Email</Label>
              <Input
                className="mt-2 border-white/30"
                placeholder="Your email address"
              />
            </div>
            <Button className="w-full" size={"lg"}>
              Continue
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 min-h-[0.5px]  bg-muted-foreground" />
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="flex-1 min-h-[0.5px]  bg-muted-foreground" />
          </div>
          <Button
            className=""
            disabled={loading}

            onClick={() =>
              handleSignIn()
            }
            size={"lg"}
            variant={"outline"}
          >
            {

            }
            <Image alt="" height={16} src={"/google-logo.svg"} width={16} />
            Continue with Google
          </Button>
          <div className="mx-auto text-muted-foreground">
            Don't have an account?{" "}
            <Link className="text-foreground hover:underline" href={"/sign-up"}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
