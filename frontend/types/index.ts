// export and create interfaces specify how specific structure should look like
export interface CamProps {
  containerStyles?: string
}

export interface SnackbarProps {
  open: boolean;
  autoHideDuration?: number;
  onClose: () => void;
  message: string;
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX | string;

export enum MoodType {
  SAD = '😞',
  ANGRY = '😡',
  HAPPY = '🤩'
}

export type MoodKeyType = keyof typeof MoodType