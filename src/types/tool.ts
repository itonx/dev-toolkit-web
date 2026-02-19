/**
 * Represents a tool in the DEV Toolkit
 */
export interface Tool {
  /** Unique identifier for the tool */
  id: string;
  /** Display name of the tool */
  name: string;
  /** Brief description of what the tool does */
  description: string;
  /** Emoji or icon identifier for the tool */
  icon: string;
}
