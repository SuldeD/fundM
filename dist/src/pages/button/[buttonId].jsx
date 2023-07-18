"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("app/utils/api");
const router_1 = require("next/router");
function Button() {
    const { query } = (0, router_1.useRouter)();
    const buttonId = query.buttonId;
    const { data } = api_1.api.loan.accountStatus.useQuery();
    console.log(data);
    return (<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="">
        <p>{JSON.stringify(data)}</p>
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => { }}>
          Click me
        </button>
      </div>
    </main>);
}
exports.default = Button;
