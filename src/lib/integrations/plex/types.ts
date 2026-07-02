// Slices of Plex Media Server responses that we actually use.

export interface PlexNowPlayingSession {
  id: string;
  /** Movie title, or episode title for TV */
  title: string;
  /** Show title when type === "episode", artist when "track" */
  grandparentTitle?: string;
  /** "SxEy" label for episodes */
  episodeLabel?: string;
  type: "movie" | "episode" | "track" | string;
  user: string;
  playerState: "playing" | "paused" | "buffering" | string;
  /** 0–100 */
  progressPercent: number;
  /** Plex-internal image path, served to the browser via /api/plex/image */
  thumb?: string;
  videoDecision?: "directplay" | "copy" | "transcode" | string;
}

export interface PlexRecentItem {
  id: string;
  title: string;
  /** Show title when the item is a season/episode */
  grandparentTitle?: string;
  type: string;
  year?: number;
  addedAt: number;
  thumb?: string;
}

// Raw response shapes (partial)

export interface PlexMediaContainer<M> {
  MediaContainer: {
    size: number;
    Metadata?: M[];
  };
}

export interface PlexSessionMetadata {
  ratingKey: string;
  title: string;
  grandparentTitle?: string;
  parentIndex?: number;
  index?: number;
  type: string;
  viewOffset?: number;
  duration?: number;
  thumb?: string;
  grandparentThumb?: string;
  User?: { title: string };
  Player?: { state: string };
  Media?: { Part?: { decision?: string }[]; videoDecision?: string }[];
  TranscodeSession?: { videoDecision?: string };
}

export interface PlexRecentMetadata {
  ratingKey: string;
  title: string;
  grandparentTitle?: string;
  parentTitle?: string;
  type: string;
  year?: number;
  addedAt: number;
  thumb?: string;
  parentThumb?: string;
  grandparentThumb?: string;
}
