import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Divider } from "@mui/material";

import bicepIcon from '@/images/icons/bicep_color.png'
import squatsIcon from '@/images/icons/squats_color.png'
import bridgingIcon from '@/images/icons/bridging_color.png'
import { Icon } from "./Icon";
import { MoodType, MoodKeyType } from "../../types";
import { useState } from "react";


interface submitDialogProp {
  open: boolean;
  countsSummary: {
    curls: number;
    squats: number;
    bridges: number;
  };
  score: number;
  handleClose: () => void;
  handleSubmit: (mood: MoodKeyType) => void;
}
const SubmitDialog = ({ open, countsSummary, score, handleClose, handleSubmit }: submitDialogProp) => {

  const [mood, setMood] = useState<MoodKeyType | null>(null)
  const handleSelect = (mood: MoodKeyType) => {
    setMood(mood)
  }

  const resetDialog = () => {
    setMood(null)
  }

  const handleCloseDialog = (e: React.FormEvent<HTMLFormElement>, reason: string) => {
    // Disable drop click
    if (reason === 'backdropClick') return
    resetDialog();
    handleClose();
  }
  return <Dialog
    open={open}
    onClose={handleCloseDialog}
    disableEscapeKeyDown={true}
    PaperProps={{
      component: 'form',
      onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (mood) handleSubmit(mood)
      },
    }}
  >
    <DialogTitle>Congratulations 🎉</DialogTitle>
    <DialogContent
      className="min-w-96">
      <div className="text-xl mb-2">Total Score: <span className="font-bold">{score}</span></div>
      <div className="flex items-center justify-between w-full min-w-96 h-24">
        {[{ icon: bicepIcon, count: countsSummary.curls, size: 80, color: '#ef5d43' }, { icon: squatsIcon, count: countsSummary.squats, size: 90, color: '#87c7fa' }, { icon: bridgingIcon, count: countsSummary.bridges, size: 100, color: '#b94497' }]
          // .filter((item) => item.count > 0)
          .map((item, i) => <div key={i} className="flex-1 text-center relative flex align-center justify-center h-full"><Icon className='inline-block rounded-full opacity-30' width={item.size} height={item.size} imgSrc={item.icon} />
            <div key={i} className="absolute top-0 left-0 mr-4 w-14 text-base align-middle text-white rounded-lg transition-all" style={{ backgroundColor: item.color }}>{item.count}</div>
          </div>)}
      </div>
      <Divider />
      <DialogContentText className="mt-4">
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
      <Button onClick={handleClose}>Discard</Button>
      <Button type="submit">Submit</Button>
    </DialogActions>
  </Dialog>
}

export default SubmitDialog;
