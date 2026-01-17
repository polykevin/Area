import { Suspense } from "react";
import TrelloCallbackClient from "./TrelloCallbackClient";

export default function TrelloCallbackPage() {
  return (
    <Suspense fallback={<div>Connecting Trello…</div>}>
      <TrelloCallbackClient />
    </Suspense>
  );
}
