export type Heartbeat = { event: 'heartbeat'; id: string }
export type Enter = { event: 'enter'; id: string }
export type Exit = { event: 'exit'; id: string }

export type DoorEvent = Heartbeat | Enter | Exit
