import { nanoid } from "nanoid";
import { v4 as uuidv4, v1 as uuidv1 } from "uuid";
import { Xid } from "xid-ts";
import { ulid } from "ulid";
import { createId as cuid2 } from "@paralleldrive/cuid2";

export type IdentifierType = "uuid4" | "uuid1" | "nanoid" | "xid" | "cuid2" | "ulid";

/**
 * Generates identifiers based on the specified type and count
 * @param type The type of identifier to generate
 * @param count The number of identifiers to generate
 * @param length Optional length for identifiers that support custom length
 * @returns An array of generated identifiers
 */
export function generateIdentifiers(type: IdentifierType, count: number, length: number = 21): string[] {
  let generatedIds: string[] = [];

  switch (type) {
    case "uuid4":
      // Using the uuid library for proper UUID generation
      generatedIds = Array(count)
        .fill(0)
        .map(() => uuidv4());
      break;

    case "uuid1":
      // Using the uuid library for proper UUID generation
      generatedIds = Array(count)
        .fill(0)
        .map(() => uuidv1());
      break;

    case "nanoid":
      // Using the nanoid library with optional custom length
      generatedIds = Array(count)
        .fill(0)
        .map(() => nanoid(length));
      break;

    case "xid":
      // Using the xid library for proper XID generation
      generatedIds = Array(count)
        .fill(0)
        .map(() => new Xid().toString());
      break;

    case "cuid2":
      // Using the cuid2 library for proper CUID2 generation
      generatedIds = Array(count)
        .fill(0)
        .map(() => cuid2());
      break;

    case "ulid":
      // Using the ulid library for proper ULID generation
      generatedIds = Array(count)
        .fill(0)
        .map(() => ulid());
      break;

    default:
      const exhaustiveCheck: never = type as never;
      throw new Error(`Unhandled identifier type: ${exhaustiveCheck}`);
  }

  return generatedIds;
}
