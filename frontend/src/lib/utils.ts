import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Bounce, ToastOptions, TypeOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}


const checkIsSameDay = (d1: Date | null, d2: Date | null): boolean => {
  if (!d1 || !d2) return false
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

const showToast = (message: string, type?: TypeOptions, options?: ToastOptions) => {
  toast.dismiss() // dismiss all toast
  options = options ?? {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  }
  switch (type) {
    case 'info':
      toast.info(message, options)
      break;
    case 'success':
      toast.success(message, options)
      break;
    case 'warning':
      toast.warning(message, options)
      break;
    case 'error':
      toast.error(message, options)
      break;
    default:
      toast(message, options)
      break;
  }
}

export { checkIsSameDay, cn, showToast }