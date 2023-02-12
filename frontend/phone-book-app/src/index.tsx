import React, { useState, useEffect, ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import ContactsIcon from '@material-ui/icons/Contacts';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Box, Button, TextField, Avatar } from '@material-ui/core';
import CallIcon from '@material-ui/icons/Call';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fuse from "fuse.js";
const useStyles = makeStyles((theme) => ({
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  mainBox: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  innerBox: {
    width: '30rem',
    padding: '20px',
    background: '#f0f0f0'
  },
  childBox1: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  childBox2: {
    margin: '10px 0px',
    '& .MuiOutlinedInput-input': {
      padding: '6px',
    },
    '&  .MuiFormControl-root': {
      width: '100%'
    }
  },
  innerChild: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  listClass: {
    padding: 0,
  },
  btnclass: {
    textTransform: 'capitalize',
  },
  square: {
    color: '#ffffff',
    backgroundColor: '#CB444A',
    borderRadius: 10,
    cursor: 'pointer'
  },
  listContainer: {
    display: 'flex',
  },
  actionClass: {
    '&.MuiDialogActions-root': {
      display: 'flex',
      padding: '8px 24px',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }
  }
}));

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const Index: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [Flag, setFlag] = useState('add');
  const [Id, setId] = useState<Number>()
  const handleClickOpen = () => {
    setFlag('add');
    setOpen(true);
    setfirstName('')
    setlastName('');
    setPhoneNumber('');
  };

  const handleClose = () => {
    setOpen(false);
    setfirstName('')
    setlastName('');
    setPhoneNumber('');
  };

  const classes = useStyles();

  useEffect(() => {
    fetch('http://localhost:3000/contacts')
      .then(res => res.json())
      .then(data => setContacts(data));
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (firstName !== "" && lastName !== "" && phoneNumber !== "" && phoneNumber.length > 10) {
      const newNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
      fetch('http://localhost:3000/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phoneNumber:newNumber })
      })
        .then(res => res.json())
        .then(data => setContacts([...contacts, data]));
      handleClose()
    }

  };

  const openUpdate = (id: number, firstName: string, lastName: string, phoneNumber: string) => {
    setFlag('edit');
    setOpen(true)
    setId(id)
    setfirstName(firstName)
    setlastName(lastName);
    setPhoneNumber(phoneNumber);
  }
  const handleUpdate = () => {
    const newNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
      fetch(`http://localhost:3000/contacts/${Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phoneNumber: newNumber })
      })
        .then(res => res.json())
        .then(data => {
          setContacts(
            contacts.map(contact =>
              contact.id === Id ? { ...contact, firstName, lastName, phoneNumber } : contact
            )
          )
        }

        );
   
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:3000/contacts/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() =>
        setContacts(contacts.filter(contact => contact.id !== id))
      );
  };

  const fuse = new Fuse(contacts, {
    keys: ["lastName"],
    includeScore: true,
    threshold: 0.3,
  });
  const results = query ? fuse.search(query) : [];

  const newResults = query ? results.map((result) => result.item) : contacts;
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.currentTarget.value);
  }

  return (
    <Box className={classes.mainBox}>
      <Box className={classes.innerBox}>
        <Typography variant="h3" className={classes.title}>
          <ContactsIcon style={{ fontSize: 40 }} /> Phone Book App
        </Typography>
        <Box className={classes.childBox1}>
          <Typography variant="h6">
            Contacts
          </Typography>
          <Button className={classes.btnclass}
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClickOpen}>
            + Add Contact
          </Button>
        </Box>
        <Box className={classes.childBox2}>
          <TextField
            variant="outlined"
            placeholder='Search for contact by last name...'
            onChange={handleSearch}
            fullWidth />
        </Box>
        <Box className={classes.demo}>
          <List className={classes.listClass}>
            {newResults.map(contact => (
              <ListItem key={contact.id}>
                <ListItemText
                  primary={`${contact.firstName + " " + contact.lastName}`}
                  secondary={<Box className={classes.innerChild}>
                    <CallIcon style={{ fontSize: 16 }} />
                    <Typography>{contact.phoneNumber}</Typography>
                  </Box>}
                />
                <ListItemSecondaryAction className={classes.listContainer}>
                  <Avatar variant="square" style={{ marginRight: 10 }} className={classes.square} onClick={() => openUpdate(contact.id, contact.firstName, contact.lastName, contact.phoneNumber)}>
                    <EditIcon style={{ fontSize: 16 }} />
                  </Avatar>
                  <Avatar variant="square" className={classes.square} onClick={() => handleDelete(contact.id)}>
                    <DeleteIcon style={{ fontSize: 16 }} />
                  </Avatar>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='sm'>
        <DialogTitle id="form-dialog-title" style={{ padding: '8px 24px' }}>{Flag === 'add' ? "Add Contact" : "Update Contact"}</DialogTitle>
        <form onSubmit={Flag === 'add' ? handleSubmit : handleUpdate}>
          <DialogContent>
            <TextField
              type="text"
              placeholder="Firstname"
              value={firstName}
              variant='outlined'
              fullWidth
              onChange={e => setfirstName(e.target.value)}
              className={classes.childBox2}
            />
            <TextField
              type="text"
              placeholder="Lastname"
              value={lastName}
              variant='outlined'
              fullWidth
              onChange={e => setlastName(e.target.value)}
              className={classes.childBox2}
            />
            <TextField
              type="text"
              placeholder="Phone number"
              value={phoneNumber}
              variant='outlined'
              fullWidth
              onChange={e => setPhoneNumber(e.target.value)}
              className={classes.childBox2}
            />
          </DialogContent>
          <DialogActions className={classes.actionClass}>
            <Button onClick={handleClose} variant="outlined" size="small" color="primary" className={classes.btnclass}>
              Cancel
            </Button>
            <Button type='submit' variant="contained" size="small" color="primary" className={classes.btnclass}>
              {Flag === 'add' ? "Add Contact" : "Update Contact"}
            </Button>

          </DialogActions>
        </form>
      </Dialog>
    </Box>

  );
};

export default Index;
