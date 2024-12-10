### BUILD
FROM node:20-alpine AS build

WORKDIR /usr/app

COPY ./.yarn/cache													./.yarn/cache
COPY ./.yarn/releases												./.yarn/releases
COPY ./.yarnrc.yml													./
COPY ./package.json													./
COPY ./tsconfig.base.json											./
COPY ./yarn.lock													./

COPY ./packages/cron 												./packages/cron
COPY ./packages/db													./packages/db
COPY ./packages/shared-server										./packages/shared-server
COPY ./packages/shared-backend										./packages/shared-backend

RUN yarn install && \
	yarn prisma:generate && \
	yarn workspace @chihuahua-dashboard/cron build && \
	yarn workspaces focus @chihuahua-dashboard/cron --production

# ### PRODUCTION
FROM node:20-alpine
WORKDIR /usr/app

COPY --from=build /usr/app/package.json								./package.json

COPY --from=build /usr/app/packages/cron/package.json				./packages/cron/package.json
COPY --from=build /usr/app/packages/cron/dist						./packages/cron/dist

COPY --from=build /usr/app/packages/shared-server/package.json		./packages/shared-server/package.json
COPY --from=build /usr/app/packages/shared-server/dist				./packages/shared-server/dist

COPY --from=build /usr/app/packages/shared-backend/package.json		./packages/shared-backend/package.json
COPY --from=build /usr/app/packages/shared-backend/dist				./packages/shared-backend/dist

COPY --from=build /usr/app/node_modules								./node_modules

ENV TZ Europe/Prague
ENV NODE_ENV production

RUN apk add --no-cache tzdata \
	&& ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

USER 1000:1000

CMD [ "sh", "-c", "node --enable-source-maps ./packages/cron/dist/main.js" ]