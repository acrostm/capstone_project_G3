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