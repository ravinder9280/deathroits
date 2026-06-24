import { Button } from '@monorepo/ui/components/button'
import React, { useState } from 'react'
import { signIn } from './auth-client'
import { toast } from 'sonner'
import Image from 'next/image'
import { Spinner } from '@monorepo/ui/components/spinner'

const GoogleSignIn = ({ redirect }: { redirect: string }) => {
    const [loading, setLoading] = useState(false)


    const handleSignIn = async () => {




        const { data, error } = await signIn.social({
            callbackURL: process.env.NEXT_PUBLIC_URL + redirect,

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
            < Image alt="" height={16} src={"/google-logo.svg"} width={16} />
            Continue with Google
            {
                loading && <Spinner />
            }
        </Button>
    )
}

export default GoogleSignIn