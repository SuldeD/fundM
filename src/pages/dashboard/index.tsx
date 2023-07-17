import { api } from "app/utils/api";
import React from "react";

export default function index() {
  const { data } = api.loan.accountInfo.useQuery();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div>{JSON.stringify(data)}</div>
    </main>
  );
}
