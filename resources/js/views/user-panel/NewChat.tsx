import React, {useEffect, useRef, useState} from 'react'
import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    Grid, IconButton, InputAdornment,
    InputLabel, Menu,
    MenuItem, Modal,
    Select, Snackbar,
    TextareaAutosize, TextField,
    Typography
} from "@mui/material";
import theme from "./../../Custom";
import SendIcon from '@mui/icons-material/Send';
import axios from './../../axiosConfig';
import {useMutation, useQuery} from "react-query";
import {route} from './helpers'
import {useParams} from "react-router-dom";
import {Alert} from "@mui/lab";
import {useForm} from "react-hook-form";
import EmojiPicker, {EmojiClickData} from "emoji-picker-react";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ClearIcon from '@mui/icons-material/Clear';
import {AudioRecorder} from "react-audio-voice-recorder";


export default function TicketChat(){
    const [chat, setChat] = React.useState([]);
    const [age, setAge] = React.useState('');
    const [inputValue, setInputValue] = useState('');
    const params = useParams();
    const chatBoxRef = useRef(null);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [status, setStatus] = React.useState("success");
    const [message, setMessage] = React.useState("This is a success message!");
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openE = Boolean(anchorEl);

    //react hook forms config
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isValid},
    } = useForm({mode: "onBlur"});
    const onSubmit = (data) => {
        console.log(inputValue)
        sendMessage.mutate(data, {
            onSuccess: () => {
                setInputValue('');
                reset()
            }
        });
    };

    //ٍEmoji config
    const handleClose = ({back}) => {
        setAnchorEl(null);
    };

    function onClickShowEmoji(emojiData: EmojiClickData, event: MouseEvent) {
        const newInputValue = inputValue + (emojiData.isCustom ? emojiData.unified : emojiData.emoji);
        setInputValue(newInputValue);
        setValue("text", newInputValue); // Update the form value
    }

    const openEmoji = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const scrollToBottom = () => {
        console.log("akbar")
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollIntoView({behavior: "smooth", block: "end"});
        }
    };

    const sendMessage = useMutation(async (data) => {
            const response = await axios.post(route("api.web.v1.user.message",{ticket:params.id}),data);
            return response.data;
        }, {
            onSuccess: (data) => {
                setOpenSnack(true);
                setStatus("success");
                setMessage("تیکت ارسال شد");
                setTimeout(()=>{
                    scrollToBottom();
                },3000)
            },
            onError: () => {
                setOpenSnack(true);
                setStatus("error");
                setMessage("ارسال تیکت مشکل مواجه شد");
            },
            onSettled: () => {
            },
        }
    )


    const Messages = useQuery("Messages", async () => {
        const { data } = await axios.get(
            route("api.web.v1.user.messages",{ticket:params.id})
        );
        // Messages.data = data.data;
        return data;
    },{
        onSuccess: (data) => {
            setChat(data)
            setFile(data.image_messages)
            setTimeout(()=>{
                scrollToBottom();
            },1000)
        }});

    const TempFiles = useMutation(async (formData) => {
            console.log(formData)
            const response = await axios.post(route("api.web.v1.user.temporary-file.store"), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        }, {
            onSuccess: (data) => {

            },
            onError: () => {

            },
            onSettled: () => {
            },
        }
    )

    const connectWebSocket = () => {
        window.Echo.private(`messages.${params.id}`)
            .listen('MessageEvent', (data) => {
                setChat(prev => {
                    return {
                        ...prev,
                        messages: [...prev.messages, {
                            ...data.message,
                            is_sender: data.message.user_id === prev.id
                        }]
                    };
                });
            });
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            window.Echo.leave("messages");
        }
    }, []);

    //Audio message config
    const sendAudioMessage = async (audioBlob) => {
        // Create a File object from the Blob
        const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, {type: audioBlob.type});

        // Create a FormData object
        const formData = new FormData();

        // Append the audio file to the FormData
        formData.append('audio', audioFile);


        try {
            const result = await TempFiles.mutateAsync(formData);
            console.log('Audio file uploaded successfully:', result);

            await sendMessage.mutateAsync({
                audio: result,
                type: "audio",
            });

            // Refetch messages after sending
        } catch (error) {
            console.error('Error uploading audio file:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
        }
    };

    //upload image
    async function handleChange(e) {
        const selectedFiles = Array.from(e.target.files);
        console.log(selectedFiles);

        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const result = await TempFiles.mutateAsync(formData);
                console.log('File uploaded successfully:', result);

                setFile(prevFiles => [
                    ...prevFiles,
                    {
                        file: file,
                        url: URL.createObjectURL(file),
                        tempId: result.id // Assuming the server returns an id for the temporary file
                    }
                ]);
                setValue("file", result)
                setValue("type", "image")
            } catch (error) {
                console.error('Error uploading file:', error);
                // Handle error (e.g., show an error message to the user)
            }
        }
    }

    //preview handling
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (url) => {
        setSelectedImage(url);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleclear = (url) => {
        setFile(prevFiles => prevFiles.filter(file => file.url !== url));
    }
    const [file, setFile] = React.useState([]);


    return(
        <Box position="absolute" dir="rtl" display="flex" justifyContent="center" alignItems="center" height="92vh"   sx={{
            width: '100%',
            '@media (min-width: 900px)': {width: '84%',}
            ,}} marginTop={{xs:6,md:7}} p={{xs:1,md:7}} >
            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={() => {
                    setOpenSnack(false);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => {
                        setOpenSnack(false);
                    }}
                    severity={status}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
            <Grid item display="flex" p={{xs:1,md:3}} height={{xs: "calc(100vh - 90px)", md: "auto"}} mt={{xs:7,md:0}} flexDirection="column" boxShadow={3} borderRadius="20px" bgcolor="#F4F4F4"  width="100%">
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography sx={{height:"10%"}}>
                        تيكت باز شده در{Messages?.data?.create}
                    </Typography>
                    {/*<Button  variant="contained" sx={{width:"10%",pl:2,borderRadius:"20px"}}>*/}
                    {/*   بستن تیکت*/}
                    {/*</Button>*/}
                </Box>
                <Divider sx={{mt:"10px"}}/>
                <Box display="flex" flexDirection="row" width="100%">
                    <Box display="flex" flexDirection="column" width={{xs:"100%",md:"60%"}}>
                        <Typography fontWeight="900">
                            {Messages?.data?.ticket_title}
                        </Typography>
                        <Typography>آخرین آپدیت در{Messages?.data?.update}</Typography>
                        <Box sx={{ height: {xs: "calc(100vh - 260px)",md:"363px"}, overflowY: 'auto' }}>
                            <Box width="100%" ref={chatBoxRef} display="flex" justifyContent="flex-end" flexDirection="column" p={1}>
                                {chat?.messages?.map((item, index) => (
                                    item.is_sender ?
                                        (<Box display="flex" justifyContent="start" flexDirection="row" gap={1}
                                              key={index}>
                                            {/*<Avatar></Avatar>*/}
                                            {item.type === 'audio' ? (
                                                <Box display="flex" alignItems="center">
                                                    <audio src={item.audio} controls/>
                                                    <Typography fontSize={10} color="gray">{item.time}</Typography>
                                                </Box>
                                            ) : item.type === 'image' ?
                                                <>
                                                    <img src={item.url} style={{
                                                        objectFit: "cover",
                                                        width: "50%",
                                                        height: "50%",
                                                        aspectRatio: "1/1",
                                                        borderRadius: 20,
                                                        margin: "2px"
                                                    }}
                                                         onClick={() => handleImageClick(item.url)}
                                                    />
                                                    <Typography fontSize={10} color="gray">{item.time}</Typography>
                                                </>
                                                : (
                                                    <>
                                                        <Typography
                                                            bgcolor={theme.palette.Primary[20]}
                                                            borderRadius="20px"
                                                            maxWidth="50%"
                                                            p={1}
                                                            mt={1}
                                                            style={{
                                                                wordBreak: 'break-word',
                                                            }}
                                                        >
                                                            {item.text}
                                                        </Typography>
                                                        <Typography mt={2.5} fontSize={10} color="gray">{item.time}</Typography>
                                                    </>
                                                )}
                                        </Box>) :
                                        (<Box display="flex" justifyContent="end" flexDirection="row" gap={1}
                                              key={index}>
                                            {/*<Avatar></Avatar>*/}
                                            {item.type === 'audio' ? (
                                                <Box display="flex" alignItems="center">
                                                    <Typography fontSize={10} color="gray">{item.time}</Typography>
                                                    <audio src={item.audio} controls/>
                                                </Box>
                                            ) : item.type === 'image' ?
                                                <>
                                                    <Typography fontSize={10} color="gray">{item.time}</Typography>
                                                    <img src={item.url} style={{
                                                        objectFit: "cover",
                                                        width: "50%",
                                                        height: "50%",
                                                        aspectRatio: "1/1",
                                                        borderRadius: 20,
                                                        margin: "2px"
                                                    }}
                                                         onClick={() => handleImageClick(item.url)}
                                                    />
                                                </>
                                                : (
                                                    <>
                                                        <Typography mt={2.5} fontSize={10} color="gray">{item.time}</Typography>
                                                        <Typography
                                                            bgcolor={theme.palette.Primary[20]}
                                                            borderRadius="20px"
                                                            maxWidth="50%"
                                                            p={1}
                                                            mt={1}
                                                            style={{
                                                                wordBreak: 'break-word',
                                                            }}
                                                        >
                                                            {item.text}
                                                        </Typography>
                                                    </>
                                                )}
                                        </Box>)
                                ))}
                            </Box>
                        </Box>
                        <TextField
                            value={inputValue}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setInputValue(newValue);
                                setValue("text", newValue);
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                    mt: 2,
                                    pl: 5,
                                    backgroundColor: theme.palette.Primary[20], borderRadius: '20px',
                                    boxShadow: {xs: 3, md: 0},
                                    width: {xs: "100%", md: "97%"}
                                },
                            }}

                            InputProps={{
                                startAdornment: (
                                    <>
                                        <InputAdornment
                                            onClick={handleSubmit(onSubmit)}
                                            position="start"
                                        >
                                            <IconButton>
                                                <SendIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                        <AudioRecorder
                                            onRecordingComplete={sendAudioMessage}
                                            audioTrackConstraints={{
                                                noiseSuppression: true,
                                                echoCancellation: true,
                                            }}
                                            onNotAllowedOrFound={(err) => console.table(err)}
                                            mediaRecorderOptions={{
                                                audioBitsPerSecond: 128000,
                                            }}
                                            showVisualizer={true}
                                        />
                                        <Box height="100%" display="flex" alignItems="center">
                                            <IconButton id="basic-button" sx={{mx: 1}}
                                                        aria-controls={openE ? 'basic-menu' : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={openE ? 'true' : undefined}
                                                        onClick={openEmoji}
                                            >
                                                <SentimentSatisfiedOutlinedIcon/>
                                            </IconButton>
                                        </Box>
                                        <Menu
                                            sx={{position: "absolute", bottom: 90, padding: 0}}
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={openE}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            <MenuItem sx={{padding: 0}}>
                                                <EmojiPicker height={500}
                                                             onEmojiClick={onClickShowEmoji}/>
                                            </MenuItem>
                                        </Menu>
                                        <Box height="100%" display="flex" alignItems="center">
                                            <input accept="image/*" id="icon-button-file" type="file"
                                                   style={{display: "none"}} onChange={handleChange}/>
                                            <label htmlFor="icon-button-file">
                                                <IconButton color="primary" component="span">
                                                    <AttachFileIcon/>
                                                </IconButton>
                                            </label>
                                        </Box>
                                    </>
                                ),
                            }}
                        ></TextField>
                    </Box>
                    <Box width="30%" display={{xs: "none", md: "flex"}} alignItems="start" flexDirection='column' p={1}>
                        <Typography fontWeight="900" mt={2}>جزییات</Typography>
                        <Divider sx={{mt: "10px"}}/>
                        <Typography mt={2} fontWeight="500">فایل های پیوست</Typography>
                        <Box display="flex" gap={2} flexDirection="column" width="463px" sx={{height: {xs: "300px", md: "363px"}, overflowY: 'auto'}}>
                            {file?.map((item, index) =>
                                <Box display="flex" flexDirection="row" width="100%" height="40%" alignItems="center" gap={2}>
                                    <img style={{
                                        objectFit: "cover",
                                        width: "50%",
                                        height: "100%",
                                        aspectRatio: "1/1",
                                        borderRadius: 20,
                                    }} src={item.url}
                                         onClick={() => handleImageClick(item.url)}
                                    />
                                    <Box display="flex" flexDirection="column">
                                        <Typography> ارسال شده در</Typography>
                                        <Typography>{item.image_create}</Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                        <Modal
                            open={!!selectedImage}
                            onClose={handleCloseModal}
                            aria-labelledby="image-preview"
                            aria-describedby="full-screen-image-preview"
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    maxWidth: '90vw',
                                    maxHeight: '90vh',
                                }}
                            >
                                <img
                                    src={selectedImage}
                                    alt="Full screen preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                        </Modal>
                    </Box>
                </Box>
            </Grid>
        </Box>
    )
}
