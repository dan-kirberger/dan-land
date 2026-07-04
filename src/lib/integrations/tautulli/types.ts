export interface TautulliSession {
  id: string;
  user: string;
  /** e.g. "The Bear - S3E2 - Sundae" (Tautulli's full_title) */
  title: string;
  mediaType: string;
  state: "playing" | "paused" | "buffering" | string;
  /** 0–100 */
  progressPercent: number;
  /** "direct play" | "copy" | "transcode" */
  transcodeDecision: string;
  /** Plex-internal image path, served via /api/tautulli/image */
  thumb?: string;
}

export interface TautulliRecentItem {
  id: string;
  title: string;
  mediaType: string;
  year?: number;
  addedAt: number;
  thumb?: string;
}

// Raw response shapes (partial)

export interface TautulliResponse<T> {
  response: { result: string; data: T };
}

export interface TautulliActivityData {
  stream_count: string;
  sessions: {
    session_key: string;
    user: string;
    full_title: string;
    media_type: string;
    state: string;
    progress_percent: string;
    transcode_decision: string;
    thumb?: string;
    grandparent_thumb?: string;
  }[];
}

export interface TautulliRecentData {
  recently_added: {
    rating_key: string;
    title: string;
    parent_title?: string;
    grandparent_title?: string;
    media_type: string;
    year?: string;
    added_at: string;
    thumb?: string;
    parent_thumb?: string;
    grandparent_thumb?: string;
  }[];
}
