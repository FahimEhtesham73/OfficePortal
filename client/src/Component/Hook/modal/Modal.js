import { Dialog, DialogContent, DialogTitle, styled } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";


// Modal Styling
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        overflowY: 'revert',
    marginTop: '20px'
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
        overflowY: 'revert',
    marginTop: '20px'
    },
}));


function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}


const Modal = ({title,open, handleClickClose, setOpen,children}) => {

  
  return (
    <BootstrapDialog
                onClose={handleClickClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleClickClose}>
                    {title}
                </BootstrapDialogTitle>
                {children}
                {/* <DialogContent sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                   
                </DialogContent> */}
                {/* <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ borderRadius: "50px", width: 150 }} autoFocus onClick={createALeaveRequest}>
                        Apply
                    </Button>
                </DialogActions> */}
            </BootstrapDialog>
  )
}

export default Modal