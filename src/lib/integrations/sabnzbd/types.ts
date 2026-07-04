export interface SabQueueSlot {
  filename: string;
  status: string;
  /** 0–100 */
  percentage: number;
  timeleft: string;
  sizeLeftMb: number;
}

export interface SabQueue {
  paused: boolean;
  /** Human-readable, e.g. "3.2 M" */
  speed: string;
  slots: SabQueueSlot[];
}

// Raw response (partial)
export interface SabQueueResponse {
  queue: {
    paused: boolean;
    speed: string;
    slots: {
      filename: string;
      status: string;
      percentage: string;
      timeleft: string;
      mbleft: string;
    }[];
  };
}
