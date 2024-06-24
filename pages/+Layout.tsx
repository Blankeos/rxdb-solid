import { RxDBContextProvider } from "@/stores/database.store";
import "@/styles/app.css";

import { type FlowProps } from "solid-js";

export default function RootLayout(props: FlowProps) {
  return (
    <RxDBContextProvider>
      <div class="h-screen flex flex-col">{props.children}</div>
    </RxDBContextProvider>
  );
}
