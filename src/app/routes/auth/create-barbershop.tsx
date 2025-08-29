import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const CreateBarbershopPage = lazy(() =>
  import("@features/barbershop/_index").then((module) => ({
    default: module.CreateBarbershopPage,
  })),
);

export const Route = createFileRoute("/auth/create-barbershop")({
  component: () => <CreateBarbershopPage />,
});
