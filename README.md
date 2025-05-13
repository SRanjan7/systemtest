- Node.js installed 
    # npm install
- PostgreSQL running and configured in `.env`
- Prisma migration already applied (`npx prisma migrate dev`)

- run server
# npm run dev


- api

to register
post- http://localhost:5005/api/auth/register

to login
post- http://localhost:5005/api/auth/login

xl file upload 
post- http://localhost:5005/api/upload-chat

get chat history
get- http://localhost:5005/api/getChats