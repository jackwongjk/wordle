This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

**Node version required:**  
Use **Node.js v20.19.4** for best compatibility.

### 1. Create the `.env` file

First, create a `.env` file inside the `wordle` folder with the following format:

```env
# The maximum number of tries before game over
MAX_TRIES=6

# The list of 5-letter words, separated by commas (no spaces)
WORDS=apple,table,chair,plant,grape,bread,light,water,house,music
```

- `MAX_TRIES` sets how many guesses a player can make.
- `WORDS` is a comma-separated list of valid 5-letter words.

### 2. Install dependencies

Run one of the following commands in the `wordle` folder to install all libraries:

```bash
pnpm install --frozen-lockfile
# or
npm ci
```

### 3. Run the development server

Start the development server with:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.




