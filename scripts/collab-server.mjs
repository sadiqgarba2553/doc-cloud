import { WebSocketServer } from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync.js';
import * as awarenessProtocol from 'y-protocols/awareness.js';
import * as encoding from 'lib0/encoding.js';
import * as decoding from 'lib0/decoding.js';

const PORT = process.env.PORT || 1234;
const wss = new WebSocketServer({ port: PORT });

const docs = new Map();

function getYDoc(docName) {
  let doc = docs.get(docName);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(docName, doc);
  }
  return doc;
}

console.log(`[Doc Cloud] Real-Time Collaboration Server running on ws://localhost:${PORT}`);

wss.on('connection', (conn, req) => {
  const docName = req.url.slice(1).split('?')[0] || 'default-doc';
  const doc = getYDoc(docName);

  conn.binaryType = 'arraybuffer';

  // Send initial Sync step 1
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, 0); // messageSync
  syncProtocol.writeSyncStep1(encoder, doc);
  conn.send(encoding.toUint8Array(encoder));

  conn.on('message', (message) => {
    try {
      const uint8 = new Uint8Array(message);
      const decoder = decoding.createDecoder(uint8);
      const messageType = decoding.readVarUint(decoder);

      if (messageType === 0) {
        // sync
        const replyEncoder = encoding.createEncoder();
        encoding.writeVarUint(replyEncoder, 0);
        syncProtocol.readSyncMessage(decoder, replyEncoder, doc, null);
        if (encoding.length(replyEncoder) > 1) {
          conn.send(encoding.toUint8Array(replyEncoder));
        }
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  conn.on('close', () => {
    // client disconnected
  });
});
