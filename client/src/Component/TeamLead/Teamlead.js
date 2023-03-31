import React, { useState } from 'react'
// Importing from MUI
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';



// Multiple User Select Styling
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'MD. Saimom Islam',
    'Touhidur Shuvo',
    'Arafath Protik',
    'Badhon Rahman',
    'Arif',
    'Ibrahim',
    'Nuhas',
    'Faysal',
    'Sakir',
    'Jahid',
    'Sakib'
];

// Modal Styling
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
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

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};
const Teamlead = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalOpen, setModalOpen] = useState(false)
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // For Modal open
    const handleClickOpen = () => {
        setModalOpen(true);
    };
    // For Modal Close
    const handleClickClose = () => {
        setModalOpen(false);
    };
    // Modal Multiple user Select
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const settings = ['Assign Member', 'Edit Project',];
    const temLeads = [
        {
            name: 'Nahid',
            title: 'Team Lead AI',
            project: 'Otsuka'
        },
        {
            name: 'Saiful',
            title: 'Team Lead AI',
            project: 'R&D'
        },
        {
            name: 'Kazal',
            title: 'Team Lead testing',
            project: 'Data Annotation'
        },
        {
            name: 'Aminul',
            title: 'Team Lead AI',
            project: 'NER Data Extraction'
        },
        {
            name: 'Mredul',
            title: 'Team Lead GUI',
            project: 'Otsuka GUI'
        }
    ]
    const menu = (
        <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleClose}>
                    <Typography textAlign="center" onClick={handleClickOpen}>{setting}</Typography>
                </MenuItem>
            ))}
        </Menu>
    )
    return (
        <Box sx={{marginLeft:{sm:'30px',md:"280px"}}}>
            <Box >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Current Team Lead</Typography>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", }}>
                    {
                        temLeads.map((val, ind) => {
                            return (
                                <Card key={ind} elevation='4' sx={{ minWidth: 365, maxHeight: 345, margin: "40px 20px 40px 0px" }}>
                                    <CardHeader
                                        action={
                                            <IconButton aria-label="settings" onClick={handleClick}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        }
                                    />
                                    {menu}
                                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', marginBottom: "15px" }}>
                                        <CardContent>
                                            <Avatar alt='Employee' sx={{ width: 120, height: 120 }} />
                                        </CardContent>
                                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{val.name}</Typography>
                                        <Typography sx={{ fontSize: '13px' }}>{val.title}</Typography>
                                        <Typography sx={{ fontSize: '13px' }}>{val.project}</Typography>
                                    </Box>
                                </Card>
                            )
                        })
                    }

                </Box>

            </Box>
            {/* Modal */}
            <BootstrapDialog
                onClose={handleClickClose}
                aria-labelledby="customized-dialog-title"
                open={modalOpen}
                PaperProps={{
                    sx: {
                      width: "50%",
                      height: 350,
                      display:"flex",
                      alignItems:"center"
                    }
                  }}
            >
                <BootstrapDialogTitle id="customized-dialog-title" className="text-center" onClose={handleClickClose}>
                    Assign Member
                </BootstrapDialogTitle>
                <Box>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Select Member</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            input={<OutlinedInput label="Select Member" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={personName.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <DialogActions sx={{display:"flex",justifyContent:"center",marginTop:"150px"}}>
                    <Button variant="contained" sx={{borderRadius:"50px",width:150,bottom:0}}autoFocus onClick={handleClickClose}>
                        Assign
                    </Button>
                </DialogActions>

            </BootstrapDialog>
        </Box>
    )
}

export default Teamlead