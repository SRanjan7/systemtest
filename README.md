- Node.js installed 
    # npm install

- PostgreSQL running and configured in `.env`

PORT=5005
DATABASE_URL="postgresql://postgres:example@localhost:5432/demo_system_test?schema=system_test"
JWT_SECRET="b906d2d6ecdb364c7bde6e6dbfd5573068"

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

in form data file type should 'file'
key 'chatFile'  in value use the xlsx

get chat history
get- http://localhost:5005/api/getChats