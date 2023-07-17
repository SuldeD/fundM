import { Message } from "app/contants/schemas";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Button() {
  const { query } = useRouter();
  const buttonId = query.buttonId;

  const { data } = api.loan.accountStatus.useQuery();

  console.log(data);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="">
        <p>{JSON.stringify(data)}</p>
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => {}}
        >
          Click me
        </button>
      </div>
    </main>
  );
}
