FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile --pproduction

CMD ["bun", "index.ts"]