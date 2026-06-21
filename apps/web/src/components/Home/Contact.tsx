import React from 'react'
import { Input } from '@monorepo/ui/components/input'
import { Textarea } from '@monorepo/ui/components/textarea'
import { Button } from '@monorepo/ui/components/button'
import { Label } from '@monorepo/ui/components/label'

const Contact = ({ className }: { className?: string }) => {
  return (
    <section className={`${className} bg-primary/15 py-10 px-5 md:py-[100px] md:px-6  border-t border-[rgba(242,242,236,0.06)]`}>
      <div className='max-w-[600px] mx-auto text-center'>
        <div className="text-center flex flex-col items-center justify-center mb-10">
          <h2 className='text-[40px] md:text-[64px] font-extrabold mb-4 uppercase tracking-[-0.08em] leading-[0.95]'>
            Contact{" "}
            <span className="text-primary">Our Team</span>
          </h2>
          <p className='text-white/70 text-[16px] md:text-[18px] max-w-[700px] mx-auto leading-[1.6]'>
            Have a question, issue, or suggestion? We're here to help. Fill out the form and our team will get back to you shortly.
          </p>
        </div>

        <div className='flex flex-col gap-5 text-left'>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-2'>
              <Label className='text-white/80 text-[13px] font-semibold  tracking-wide'>
                Full Name*
              </Label>
              <Input
                placeholder='John Doe'
                className='bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-[12px]'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-white/80 text-[13px] font-semibold  tracking-wide'>
                Email Address*
              </Label>
              <Input
                type='email'
                placeholder='john@example.com'
                className='bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-[12px]'
              />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <Label className='text-white/80 text-[13px] font-semibold  tracking-wide'>
              Subject*
            </Label>
            <Input
              placeholder='e.g. Tournament issue, Prize withdrawal, General query'
              className='bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-[12px]'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label className='text-white/80 text-[13px] font-semibold  tracking-wide'>
              Message*
            </Label>
            <Textarea
              placeholder='Describe your issue or question in detail...'
              rows={5}
              className='bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-[12px] resize-none'
            />
          </div>

          <Button className='w-full h-[52px] rounded-[12px] font-bold text-[16px]  tracking-wide mt-2'>
            Send Message 
          </Button>

          <p className='text-center text-white/40 text-[13px]'>
            We typically respond within 24 hours. For urgent issues, reach us on WhatsApp.
          </p>

        </div>
      </div>
    </section>
  )
}

export default Contact