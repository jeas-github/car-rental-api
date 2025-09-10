// src/plugins/admin.ts

import AdminJS from "adminjs";
import { FastifyPluginAsync } from "fastify";
import AdminJSFastify from "@adminjs/fastify";
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import { prisma } from "@/lib/prisma";

const adminPlugin: FastifyPluginAsync = async (app) => {
  AdminJS.registerAdapter({ Database, Resource });

  const adminOptions = {
    resources: [
      {
        resource: { model: getModelByName("RentalPoint"), client: prisma },
        options: {},
      },
      {
        resource: { model: getModelByName("Car"), client: prisma },
        options: {},
      },
      {
        resource: { model: getModelByName("Client"), client: prisma },
        options: {},
      },
      {
        resource: { model: getModelByName("Rental"), client: prisma },
        options: {},
      },
      // Adicione outros modelos do Prisma aqui, se necessário
    ],
    databases: [],
    rootPath: "/admin",
  };

  const admin = new AdminJS(adminOptions);

  await AdminJSFastify.buildRouter(admin, app);
};

export default adminPlugin;
