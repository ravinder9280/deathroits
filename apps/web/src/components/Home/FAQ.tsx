import React from 'react'
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '@monorepo/ui/components/accordion'

const faqData = [
  {
    value: "what-is",
    question: "What is Deathroit?",
    answer: "Deathroit is an esports tournament platform where players can join, compete, and win real cash prizes across popular games like Free Fire, BGMI, COD Mobile, and Valorant.",
  },
  {
    value: "how-to-join",
    question: "How do I join a tournament?",
    answer: "Simply create an account, browse the available tournaments, select your game, and click Register. Some tournaments are free to enter while others have a small entry fee.",
  },
  {
    value: "free-tournaments",
    question: "Are there free tournaments available?",
    answer: "Yes! We regularly host free-to-enter tournaments so every player gets a chance to compete and win without spending a rupee. Check the tournaments page for current free events.",
  },
  {
    value: "prizes",
    question: "How do I receive my prize winnings?",
    answer: "Prize money is credited directly to your Deathroit wallet after the tournament results are verified. You can withdraw instantly to your UPI, bank account, or supported payment method.",
  },
  {
    value: "eligibility",
    question: "Who can participate in tournaments?",
    answer: "Any player above the age of 16 can participate. Some tournaments are open to all skill levels while others may have rank or region restrictions. Always check the tournament details before registering.",
  },
  {
    value: "cheating",
    question: "What happens if someone cheats or uses hacks?",
    answer: "We take fair play very seriously. Any player found cheating, using unauthorized software, or violating tournament rules will be immediately disqualified and permanently banned from the platform.",
  },
]

const FAQ = () => {
  return (
    <section className='py-10 px-5 md:py-[100px] md:px-6 bg-[#f6efe0]'>
      <div className='container mx-auto max-w-[800px]'>
        <div className='text-center mb-10'>
          <h2 className='text-[40px] md:text-[64px] font-extrabold mb-4 uppercase tracking-[-0.08em] leading-[0.95] text-black'>
            Frequently Asked
            <span className='text-primary-dark'> Questions</span>
          </h2>
          <p className='text-muted-foreground text-[16px] md:text-[18px] max-w-[700px] mx-auto leading-[1.6]'>
            Everything you need to know about competing on Deathroit. Can't find your answer? Reach out to our support team.
          </p>
        </div>
        <Accordion type='multiple'   className="space-y-3">
          {faqData.map((item) => (
            <AccordionItem className='rounded-2xl shadow overflow-hidden' key={item.value} value={item.value}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className=''>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQ