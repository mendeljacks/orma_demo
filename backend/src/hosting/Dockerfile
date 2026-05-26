FROM node:22-alpine

WORKDIR /usr/src/app

# Install backend deps first for layer caching
COPY ./backend/package.json ./backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev

# App source (backend + shared schema kept for frontend, not required by backend)
COPY ./backend ./backend
COPY ./common ./common

EXPOSE 3001

WORKDIR /usr/src/app/backend
CMD ["npm", "start"]
