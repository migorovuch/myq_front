FROM node:12 AS prod
COPY ./app/. /app
WORKDIR /app

FROM prod AS dev
RUN npm install -g @vue/cli
RUN npm install -g i18next-scanner
