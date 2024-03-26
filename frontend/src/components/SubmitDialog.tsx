import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

import bicepIcon from '@/images/icons/bicep_color.png'
import squatsIcon from '@/images/icons/squats_color.png'
import bridgingIcon from '@/images/icons/bridging_color.png'
import { Icon } from "./Icon";
import { MoodType, MoodKeyType } from "../../types";


interface submitDialogProp {
  open: boolean;
  countsSummary: {
    curls: number;
    squats: number;
    bridges: number;
  };
  mood: MoodKeyType | null
  handleClose: () => void;
  handleSelect: (mood: MoodKeyType) => void;
  handleSubmit: (mood: MoodKeyType) => void;
}
const SubmitDialog = ({ open, countsSummary, mood, handleClose, handleSelect, handleSubmit }: submitDialogProp) => {

  return <Dialog
    className="min-w-80"
    open={open}
    onClose={handleClose}
    keepMounted={true}
    PaperProps={{
      component: 'form',
      onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (mood) handleSubmit(mood)

      },
    }}
  >
    <DialogTitle>Congratulations 🎉</DialogTitle>
    <DialogContent>
      <div className="flex items-center justify-between w-full min-w-96">
        {[{ icon: bicepIcon, count: countsSummary.curls, size: 50, color: '#ef5d43' }, { icon: squatsIcon, count: countsSummary.squats, size: 60, color: '#87c7fa' }, { icon: bridgingIcon, count: countsSummary.bridges, size: 70, color: '#b94497' }]
          .map((item, i) => <div key={i} className="flex-1 text-center"><Icon className='inline-block p-0.5 m-0.5 rounded' width={item.size} height={item.size} imgSrc={item.icon} />
            <span key={i} className="mr-4 text-3xl align-middle" style={{ color: item.color }}>{item.count}</span>
          </div>)}
      </div>
      <DialogContentText>
        Mark down your current mood 😉
      </DialogContentText>
      <div className={`${!mood ? "animate-bounce-2" : ""} flex items-center justify-between  w-full h-20 mt-2`}>
        {Object.keys(MoodType).map((key) => <div key={key} className={`flex-1 text-center m-2 shadow-md flex items-center justify-center h-full hover:cursor-pointer hover:bg-sky-100 hover-div-scale-125 ${mood === key ? 'bg-sky-100' : ''}`} onClick={() => {
          handleSelect(key as MoodKeyType)
        }}>
          <div className="text-5xl">{MoodType[key as MoodKeyType]}</div>
        </div>)}
      </div>


    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button type="submit">Submit</Button>
    </DialogActions>
  </Dialog>
}

export default SubmitDialog;
