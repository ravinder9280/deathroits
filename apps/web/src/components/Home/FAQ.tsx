import React from 'react'
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@monorepo/ui/components/accordion'

const FAQ = () => {
  return (
    <section className='py-10 px-5 md:py-[100px] md:px-6 bg-[#f6efe0]'>
      <div className='container mx-auto max-w-[800px]'>
        <div className='text-center mb-10'>
          <h2 className='text-[40px] md:text-[64px] font-extrabold mb-4 uppercase tracking-[-0.08em] leading-[0.95] text-black'>
            Frequently Asked
            <span className='text-primary'> Questions</span>
          </h2>
          <p className='text-muted-foreground text-[16px] md:text-[18px] max-w-[700px] mx-auto leading-[1.6]'>
            Everything you need to know about competing on Deathroit. Can't find your answer? Reach out to our support team.
          </p>
        </div>

        <Accordion type="single" collapsible defaultValue="what-is" className="space-y-2">

          <AccordionItem value="what-is">
            <AccordionTrigger className=''>What is Deathroit?</AccordionTrigger>
            <AccordionContent>
              Deathroit is an esports tournament platform where players can join, compete, and win real cash prizes across popular games like Free Fire, BGMI, COD Mobile, and Valorant.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how-to-join">
            <AccordionTrigger className=''>How do I join a tournament?</AccordionTrigger>
            <AccordionContent>
              Simply create an account, browse the available tournaments, select your game, and click Register. Some tournaments are free to enter while others have a small entry fee.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="free-tournaments">
            <AccordionTrigger className=''>Are there free tournaments available?</AccordionTrigger>
            <AccordionContent>
              Yes! We regularly host free-to-enter tournaments so every player gets a chance to compete and win without spending a rupee. Check the tournaments page for current free events.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="prizes">
            <AccordionTrigger className=''>How do I receive my prize winnings?</AccordionTrigger>
            <AccordionContent>
              Prize money is credited directly to your Deathroit wallet after the tournament results are verified. You can withdraw instantly to your UPI, bank account, or supported payment method.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="eligibility">
            <AccordionTrigger className=''>Who can participate in tournaments?</AccordionTrigger>
            <AccordionContent>
              Any player above the age of 16 can participate. Some tournaments are open to all skill levels while others may have rank or region restrictions. Always check the tournament details before registering.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cheating">
            <AccordionTrigger className=''>What happens if someone cheats or uses hacks?</AccordionTrigger>
            <AccordionContent>
              We take fair play very seriously. Any player found cheating, using unauthorized software, or violating tournament rules will be immediately disqualified and permanently banned from the platform.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </section>
  )
}

export default FAQ