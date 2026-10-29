/**
 * In-process domain events for change-impact updates.
 * Keep handlers synchronous/async within the same deployable for now.
 */

export type DomainEvent =
  | { type: "DeadlineConfirmed"; userId: string; deadlineId: string; courseId: string }
  | { type: "DeadlineCorrected"; userId: string; deadlineId: string; fieldName: string }
  | { type: "DeadlineRejected"; userId: string; deadlineId: string }
  | { type: "SyllabusProcessingFailed"; userId: string; fileId: string; reason: string };

type Handler = (event: DomainEvent) => void | Promise<void>;

const handlers = new Set<Handler>();

export function subscribe(handler: Handler): () => void {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export async function publish(event: DomainEvent): Promise<void> {
  await Promise.all([...handlers].map((handler) => handler(event)));
}
