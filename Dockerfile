FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile --production

CMD ["bun", "index.ts"]