<div align="center" id="header">
 
# Visual Voicemail

<div id="header" align="center">
  <img src="https://i.imgur.com/JZhdotM.png" width="auto" height="auto">
</div>

**Created by [Max Himmel](https://www.linkedin.com/in/maxhimmel/)**

#### [DEMO HERE](https://visual-vm-web-app.vercel.app/)

</div>

## :pencil: Description

My new phone doesn't have visual voicemail and I've been missing it. My solution? Let's make my own visual voicemail with Twilio!

There were some problems which led me to this interesting solution:

1. I can only call my voicemail number to access my voicemails.
2. I can't access where the voicemails are stored.
3. I can't intercept or forward missed calls to a proprietary number.

So! **What if I created a service that dials my voicemail number**, listens for the voicemail lady's prompts, starts recording the voicemail, speech-to-text it, store the recording and the text, and then delete the original voicemail.

## :computer: Technologies Used

![T3](https://img.shields.io/badge/T3-05122A.svg?style=flat&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU4IiBoZWlnaHQ9IjE5OSIgdmlld0JveD0iMCAwIDI1OCAxOTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTY1LjczNSAyNS4wNzAxTDE4OC45NDcgMC45NzI0MTJIMC40NjU5OTRWMjUuMDcwMUgxNjUuNzM1WiIgZmlsbD0iI2UyZThmMCIvPgo8cGF0aCBkPSJNMTYzLjk4MSA5Ni4zMjM5TDI1NC4wMjIgMy42ODMxNEwyMjEuMjA2IDMuNjgyOTVMMTQ1LjYxNyA4MC43NjA5TDE2My45ODEgOTYuMzIzOVoiIGZpbGw9IiNlMmU4ZjAiLz4KPHBhdGggZD0iTTIzMy42NTggMTMxLjQxOEMyMzMuNjU4IDE1NS4wNzUgMjE0LjQ4IDE3NC4yNTQgMTkwLjgyMyAxNzQuMjU0QzE3MS43MTUgMTc0LjI1NCAxNTUuNTEzIDE2MS43MzggMTUwIDE0NC40MzlMMTQ2LjYyNSAxMzMuODQ4TDEyNy4zMjkgMTUzLjE0M0wxMjkuMDkyIDE1Ny4zMzZDMTM5LjIxNSAxODEuNDIxIDE2My4wMzQgMTk4LjM1NCAxOTAuODIzIDE5OC4zNTRDMjI3Ljc5MSAxOTguMzU0IDI1Ny43NTkgMTY4LjM4NiAyNTcuNzU5IDEzMS40MThDMjU3Ljc1OSAxMDYuOTM3IDI0NC4zOTkgODUuNzM5NiAyMjQuOTU2IDc0LjA5MDVMMjIwLjM5NSA3MS4zNTgyTDIwMi43MjcgODkuMjUyOEwyMTAuNzg4IDkzLjUwODNDMjI0LjQwMyAxMDAuNjk2IDIzMy42NTggMTE0Ljk4MSAyMzMuNjU4IDEzMS40MThaIiBmaWxsPSIjZTJlOGYwIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNODguMjYyNSAxOTIuNjY5TDg4LjI2MjYgNDUuNjQ1OUg2NC4xNjQ4TDY0LjE2NDggMTkyLjY2OUg4OC4yNjI1WiIgZmlsbD0iI2UyZThmMCIvPgo8L3N2Zz4K)
![Twilio](https://img.shields.io/badge/-Twilio-05122A?style=flat&logo=Twilio)
![Next.js](https://img.shields.io/badge/-Next%2Ejs-05122A?style=flat&logo=Nextdotjs)
![tRPC](https://img.shields.io/badge/-tRPC-05122A?style=flat&logo=trpc)
![Prisma](https://img.shields.io/badge/-Prisma-05122A?style=flat&logo=Prisma)
![MongoDB](https://img.shields.io/badge/-MongoDB-05122A?style=flat&logo=mongodb)
![React](https://img.shields.io/badge/-React-05122A?style=flat&logo=react)
![daisyUI](https://img.shields.io/badge/-daisyUI-05122A?style=flat&logo=daisyUI)
![Tailwind](https://img.shields.io/badge/-Tailwind%20CSS-05122A?style=flat&logo=tailwindcss)
![Zod](https://img.shields.io/badge/-Zod-05122A?style=flat&logo=zod)
![TypeScript](https://img.shields.io/badge/-TypeScript-05122A?style=flat&logo=typescript)

## :art: References

- [https://visual-vm-web-app.vercel.app/](https://visual-vm-web-app.vercel.app/)

- [T3 Stack (Next.js, tRPC, ORM, Auth)](https://create.t3.gg/)

- [Twilio Voice API](https://www.twilio.com/docs/voice)

## :fast_forward: Upcoming Features

- [ ] React Native for mobile?!
  
  - [ ] Query voicemail when a call is missed (instead of manually pressing "dial" to convert voicemails)

  - [ ] Nx mono repo
