import { addRxPlugin, createRxDatabase, randomCouchString, RxDatabase } from "rxdb";
import { getConnectionHandlerSimplePeer, replicateWebRTC } from "rxdb/plugins/replication-webrtc";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { messagesSchema } from "./schema";

export async function createDb() {
  await import("rxdb/plugins/dev-mode").then((module) => addRxPlugin(module.RxDBDevModePlugin));

  const db = await createRxDatabase({
    name: "awesome",
    storage: getRxStorageDexie(),
  });

  await db.addCollections({
    messages: {
      schema: messagesSchema,
    },
  });

  return db;
}

export async function saveMessage(db: RxDatabase, name: string, message: string) {
  await db.messages.insert({
    id: randomCouchString(10),
    name,
    message,
    timestamp: new Date().toISOString(),
  });
}

export async function removeMessage(db: RxDatabase, id: string) {
  const doc = await db.messages.findOne({ selector: { id } }).exec();

  if (doc) {
    await doc.remove();
  }
}

export async function startReplication(db: RxDatabase, channel: string) {
  return await replicateWebRTC({
    collection: db.messages,
    topic: channel,
    connectionHandlerCreator: getConnectionHandlerSimplePeer({
      // signalingServerUrl: "wss://signaling.rxdb.info/",
      // // @ts-ignore
      // webSocketConstructor: WebSocket,
    }),
    pull: {},
    push: {},
  }).then((replicationState) => {
    replicationState.error$.subscribe((err: any) => {
      console.error(err);
    });
    replicationState.peerStates$.subscribe((s) => {
      console.log("=> new peer");
    });
  });
}
