### BUILD
FROM node:20-alpine AS build

WORKDIR /usr/app

COPY ./.yarn/cache													./.yarn/cache
COPY ./.yarn/releases												./.yarn/releases
COPY ./.yarnrc.yml													./
COPY ./package.json													./
COPY ./tsconfig.base.json											./
COPY ./yarn.lock													./

COPY ./packages/api 												./packages/api
COPY ./packages/db													./packages/db
COPY ./packages/shared-api											./packages/shared-api
COPY ./packages/shared-backend										./packages/shared-backend

RUN yarn install && \
	yarn prisma:generate && \
	yarn workspace @chihuahua-dashboard/api build && \
	yarn workspaces focus @chihuahua-dashboard/api --production

# ### PRODUCTION
FROM node:20-alpine
WORKDIR /usr/app

COPY --from=build /usr/app/package.json								./package.json

COPY --from=build /usr/app/packages/api/package.json				./packages/api/package.json
COPY --from=build /usr/app/packages/api/dist						./packages/api/dist

COPY --from=build /usr/app/packages/shared-api/package.json			./packages/shared-api/package.json
COPY --from=build /usr/app/packages/shared-api/dist					./packages/shared-api/dist

COPY --from=build /usr/app/packages/shared-backend/package.json		./packages/shared-backend/package.json
COPY --from=build /usr/app/packages/shared-backend/dist				./packages/shared-backend/dist

COPY --from=build /usr/app/node_modules								./node_modules

ENV TZ Europe/Prague
ENV NODE_ENV production

RUN apk add --no-cache tzdata \
	&& ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

USER 1000:1000

CMD [ "sh", "-c", "node --enable-source-maps ./packages/api/dist/main.js" ]