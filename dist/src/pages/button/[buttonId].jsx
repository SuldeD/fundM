"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("app/utils/api");
const router_1 = require("next/router");
function Button() {
    const { query } = (0, router_1.useRouter)();
    const buttonId = query.buttonId;
    const { mutateAsync: onSendMessage } = api_1.api.room.sendMessage.useMutation();
    api_1.api.room.onSendMessage.useSubscription({
        roomId: "12",
    }, {
        onData(n) {
            console.log("datata", n);
        },
    });
    return (<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="">
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={() => {
            onSendMessage({
                roomId: "12",
                message: "Hellotests",
            });
        }}>
          Click me
        </button>
      </div>
    </main>);
}
exports.default = Button;
