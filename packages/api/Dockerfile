### BUILD
FROM node:20-alpine AS build

WORKDIR /usr/app

COPY ./.yarn/cache														./.yarn/cache
COPY ./.yarn/releases													./.yarn/releases
COPY ./.yarnrc.yml														./
COPY ./package.json														./
COPY ./tsconfig.base.json												./
COPY ./yarn.lock														./

COPY ./packages/@types 													./packages/@types
COPY ./packages/lib/config												./packages/lib/config
COPY ./packages/lib/logger												./packages/lib/logger
COPY ./packages/lib/utils												./packages/lib/utils
COPY ./packages/engine/engine-server-core 								./packages/engine/engine-server-core
COPY ./packages/engine/engine-server	 								./packages/engine/engine-server
COPY ./packages/services/user-service 									./packages/services/user-service
COPY ./packages/tools/eslint-plugin										./packages/tools/eslint-plugin
COPY ./packages/lib/node-utils											./packages/lib/node-utils

RUN yarn install && \
	yarn workspace @chihuahua-dashboard/user-service prisma:generate && \
	yarn workspace @chihuahua-dashboard/user-service build && \
	yarn workspaces focus @chihuahua-dashboard/user-service --production

# ### PRODUCTION
FROM node:20-alpine
WORKDIR /usr/app

COPY --from=build /usr/app/package.json											./package.json

COPY --from=build /usr/app/packages/services/user-service/package.json			./packages/services/user-service/package.json
COPY --from=build /usr/app/packages/services/user-service/dist	 				./packages/services/user-service/dist
COPY --from=build /usr/app/packages/services/user-service/node_modules			./packages/services/user-service/node_modules

COPY --from=build /usr/app/packages/engine/engine-server-core/package.json		./packages/engine/engine-server-core/package.json
COPY --from=build /usr/app/packages/engine/engine-server-core/dist				./packages/engine/engine-server-core/dist

COPY --from=build /usr/app/packages/engine/engine-server/package.json			./packages/engine/engine-server/package.json
COPY --from=build /usr/app/packages/engine/engine-server/dist					./packages/engine/engine-server/dist

COPY --from=build /usr/app/packages/lib/config/package.json						./packages/lib/config/package.json
COPY --from=build /usr/app/packages/lib/config/dist	 							./packages/lib/config/dist

COPY --from=build /usr/app/packages/lib/logger/package.json						./packages/lib/logger/package.json
COPY --from=build /usr/app/packages/lib/logger/dist	 							./packages/lib/logger/dist

COPY --from=build /usr/app/packages/lib/utils/package.json						./packages/lib/utils/package.json
COPY --from=build /usr/app/packages/lib/utils/dist	 							./packages/lib/utils/dist

COPY --from=build /usr/app/packages/lib/node-utils/package.json					./packages/lib/node-utils/package.json
COPY --from=build /usr/app/packages/lib/node-utils/dist	 						./packages/lib/node-utils/dist

COPY --from=build /usr/app/node_modules											./node_modules

ENV TZ Europe/Prague

RUN apk add --no-cache tzdata \
	&& ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
USER 1000:1000
CMD [ "sh", "-c", "node --enable-source-maps ./packages/services/user-service/dist/main.js" ]