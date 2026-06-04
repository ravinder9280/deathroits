"use client"
import { Button } from '@monorepo/ui/components/button'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@monorepo/ui/components/dialog'
import { Label } from '@monorepo/ui/components/label'
import { Input } from '@monorepo/ui/components/input'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import { Spinner } from '@monorepo/ui/components/spinner'

const JoinTournamentModal = ({ children }: { children: React.ReactNode }) => {

    const [open, setOpen] = useState(false)
    const { id:tournamentId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [ign, setIgn] = useState('')
    const [gameUid, setGameUid] = useState('')
    const [upiId, setUpiId] = useState('')

    const handleJoinTournament = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tournament/${tournamentId}/join`, {
                ign,
                gameUid,
                upiId
            },{
                withCredentials:true
            })
            if (response.status === 201) {
                setOpen(false)
                toast.success('Tournament joined successfully', {
                    description: 'You will be notified when the tournament starts'
                })
            } else {
                toast.error(response.data.error || 'Failed to join tournament')
            }
        } catch (error) {

            toast.error('Failed to join tournament')

        }
        finally {
            setIsLoading(false)
        }

    }
    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className='w-full'>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-center'>
                        Join Tournament
                    </DialogTitle>
                    <DialogDescription className='text-center'>
                        Please enter your details to join the tournament.
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                    <div>
                        <Label>
                            IGN*
                        </Label>
                        <Input
                            value={ign}
                            onChange={(e) => setIgn(e.target.value)}
                            className='mt-1'
                            placeholder='Enter your In Game Name'
                        />
                    </div>
                    <div>
                        <Label>
                            In Game UID*
                        </Label>
                        <Input
                            value={gameUid}
                            onChange={(e) => setGameUid(e.target.value)}
                            className='mt-1'
                            placeholder='Enter your In Game UID'
                        />
                    </div>
                    <div>
                        <Label>
                            UPI ID*
                        </Label>
                        <Input
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className='mt-1'
                            placeholder='Enter your UPI ID'
                        />
                    </div>

                </div>

                <DialogFooter>
                    <Button className='w-full' disabled={isLoading} size={'xl'} onClick={handleJoinTournament}>
                        {
                            isLoading?"Joining":"Join"
                        }
                        {
                            isLoading && <Spinner/>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default JoinTournamentModal