import "server-only";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) throw new Error("Missing env: MONGODB_URI");

const uri = process.env.MONGODB_URI;

// macOS + Node.js 18+/OpenSSL 3 can fail the TLS handshake with Atlas.
// tlsAllowInvalidCertificates bypasses client-side cert verification locally.
const clientOptions =
  process.env.NODE_ENV === "development"
    ? { tls: true, tlsAllowInvalidCertificates: true }
    : {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, clientOptions).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

let indexesEnsured = false;

export async function getDb() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB ?? "esperaai");
  if (!indexesEnsured) {
    indexesEnsured = true;
    // Fire-and-forget — unique index on tmdbId for fast lookups and upsert safety
    db.collection("movies")
      .createIndex({ tmdbId: 1 }, { unique: true })
      .catch(() => {});
  }
  return db;
}
