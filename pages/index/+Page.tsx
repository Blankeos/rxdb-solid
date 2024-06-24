import { saveMessage, startReplication } from "@/database/database";
import { useRxDBContext } from "@/stores/database.store";
import { createEffect, createSignal, For } from "solid-js";

export default function Page() {
  const { db } = useRxDBContext();

  const [channel, setChannel] = createSignal<string>("channel1");
  const [handle, setHandle] = createSignal<string>("@carlo");
  const [messages, setMessages] = createSignal<{ message: string; name: string }[]>([
    { message: "Carlo", name: "@carlo" },
    { message: "Awesome dude!", name: "@carlo" },
    { message: "Oh, okay!", name: "@andrea" },
  ]);
  const [message, setMessage] = createSignal<string>("");

  createEffect(() => {
    // Initialize.
    db()
      ?.messages?.find({
        sort: [{ timestamp: "asc" }],
      })
      .$.subscribe((data) => {
        setMessages(data);
      });

    // Start Replication
    startReplication(db()!, channel());
  });

  async function onSend(ev: KeyboardEvent) {
    if (!db()) return;

    if (ev.key === "Enter") {
      saveMessage(db()!, handle(), message());
      setMessage("");
    }
  }

  return (
    <>
      <section class="flex-1 flex flex-col">
        <div class="flex gap-x-2 justify-between items-center bg-cyan-500 px-5 py-4">
          <div class="flex items-center gap-x-0.5 text-white">
            #
            <input
              class="bg-transparent focus:outline-none focus:border-b rounded-md p-1 min-w-0 w-32"
              value={channel()}
              onInput={(e) => setChannel(e.target.value)}
            />
          </div>

          <div class="flex gap-x-2 items-center">
            <img
              class="bg-neutral-200 rounded-full h-8 w-8"
              src={`https://api.multiavatar.com/${handle()}.svg`}
            />
            <input
              class="bg-white rounded-md text-neutral-800 p-1 px-3 min-w-0 w-32"
              value={handle()}
              onInput={(e) => setHandle(e.target.value)}
            />
          </div>
        </div>

        <ul class="flex-grow flex-col flex-1 bg-neutral-100 p-5 overflow-y-scroll flex gap-y-2">
          <For each={messages()}>
            {(msg) => (
              <li
                class={`rounded-full px-4 py-2 ${msg.name === handle() ? "self-end bg-cyan-400 text-white" : "self-start bg-neutral-200 text-neutral-700"}`}
              >
                <span>{msg.message}</span>
              </li>
            )}
          </For>
        </ul>

        <footer class="w-full px-5 py-4">
          <input
            placeholder="Message..."
            value={message()}
            onInput={(ev) => setMessage(ev.target.value)}
            onKeyUp={onSend}
            class="rounded-md p-2 border w-full"
          />
        </footer>
      </section>
    </>
  );
}

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button type="button" onClick={() => setCount((count) => count + 1)}>
      Counter {count()}
    </button>
  );
}
