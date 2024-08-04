import React, {useEffect, useRef, useState} from 'react'
import {
    alpha,
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
import theme from "./../../../Custom";
import SendIcon from '@mui/icons-material/Send';
import axios from './../../../axiosConfig';
import {useMutation, useQuery} from "react-query";
import {route} from './../helpers'
import {useNavigate, useParams} from "react-router-dom";
import {Alert} from "@mui/lab";
import {AudioRecorder} from 'react-audio-voice-recorder';
import EmojiPicker, {EmojiClickData} from "emoji-picker-react";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ClearIcon from '@mui/icons-material/Clear';
import {useForm} from "react-hook-form";
import FolderIcon from "@mui/icons-material/Folder";

export default function TicketChat() {

    const [age, setAge] = React.useState('');
    const [inputValue, setInputValue] = useState('');
    const [chat, setChat] = React.useState([]);
    const params = useParams();
    const chatBoxRef = useRef(null);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [status, setStatus] = React.useState("success");
    const [message, setMessage] = React.useState("This is a success message!");
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openE = Boolean(anchorEl);
    const [tempMessages, setTempMessages] = useState([]);
    const [emojiModalOpen, setEmojiModalOpen] = useState(false);
    const navigate = useNavigate();

    const openEmoji = () => {
        setEmojiModalOpen(true);
    };

// Add this function to close the emoji modal
    const closeEmojiModal = () => {
        setEmojiModalOpen(false);
    };

    //react hook forms config
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isValid},
    } = useForm({mode: "onBlur"});
    const getLatestId = () => {
        if (chat?.messages?.length > 0) {
            const latestIndex = chat?.messages?.length - 1;
            const latestItem = chat?.messages[latestIndex];
            return latestItem.id;
        }
        return null;
    };
    const latestId = getLatestId();
    console.log(latestId)
    const onSubmit = (data) => {
        setPreview(null);
        const tempId = Date.now();
        const tempMessage = {
            tempId: tempId, // Use a separate tempId
            id: latestId, // The real id will come from the server
            ...data,
            is_sender: true,
            time: new Date().toLocaleTimeString('fa-IR'),
            day: new Date().toISOString(),
        };
        setTempMessages(prev => [...prev, tempMessage]);
        setInputValue('');
        // setChat(prev => ({
        //     ...prev,
        //     messages: Array.isArray(prev.messages) ? [...prev.messages, tempMessage] : [tempMessage]
        // }));
        // Save to local storage
        const updatedTempMessages = [...tempMessages, tempMessage];
        localStorage.setItem('tempMessages', JSON.stringify(updatedTempMessages));

        sendMessage.mutate({...data, tempId: tempId}, {
            onSuccess: () => {
                reset();
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

    // const openEmoji = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };


    //Scroll auto
    const scrollToBottom = () => {
        console.log("akbar")
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollIntoView({behavior: "smooth", block: "end"});
        }
    };

    //data fetching
    const sendMessage = useMutation(async (data) => {
            console.log(data)
            const response = await axios.post(route("api.web.v1.admin.message", {ticket: params.id}), data);
            return response.data;
        }, {
            onSuccess: (data) => {
                setOpenSnack(true);
                setStatus("success");
                setMessage("تیکت ارسال شد");
                // setTimeout(()=>{
                    scrollToBottom();
                // },3000)
            },
            onError: () => {
                setOpenSnack(true);
                setStatus("error");
                setMessage("ارسال با مشکل مواجه شد");
            },
            onSettled: () => {
            },
        }
    )

    const closeTicket = useMutation(async (data) => {
            const response = await axios.put(route("api.web.v1.admin.close", {ticket: params.id}));
            return response.data;
        }, {
            onSuccess: (data) => {
                setOpenSnack(true);
                setStatus("success");
                setMessage("تیکت بسته شد");
                SetTicketClose(true)
            },
            onError: () => {
                setOpenSnack(true);
                setStatus("error");
                setMessage("بستن تیکت با مشکل مواجه شد");
            },
            onSettled: () => {
            },
        }
    )


    const Messages = useQuery("Messages", async () => {
        const {data} = await axios.get(
            route("api.web.v1.admin.messages", {ticket: params.id})
        );
        // Messages.data = data.data;
        return data;
    }, {
        onSuccess: (data) => {
            setChat(data)
            setFile(data.image_messages)
            setTimeout(() => {
                scrollToBottom();
            }, 1000)
            SetTicketClose(data?.status === 4)
        }
    },{
        onError:(e)=>{
            if (e.response.status === 401){
                navigate('/', { replace: true })}
        }
    });

    const TempFiles = useMutation(async (formData) => {
            console.log(formData)
            const response = await axios.post(route("api.web.v1.admin.temporary-file.store"), formData, {
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
    //WebSocket config
    const connectWebSocket = () => {
        window.Echo.private(`messages.${params.id}`)
            .listen('MessageEvent', (data) => {
                setChat(prev => {
                    const prevMessages = Array.isArray(prev.messages) ? prev.messages : [];
                    // Find the index of the temporary message
                    const tempIndex = prevMessages.findIndex(msg =>
                        msg.tempId && msg.id === data.message.sync_id
                    );

                    if (tempIndex !== -1) {
                        // If found, replace the temporary message
                        const updatedMessages = [...prevMessages];
                        updatedMessages[tempIndex] = {
                            ...data.message,
                            is_sender: data.message.user_id === prev.id
                        };
                        return { ...prev, messages: updatedMessages };
                    } else {
                        // If not found, add the new message
                        return {
                            ...prev,
                            messages: [...prevMessages, {
                                ...data.message,
                                is_sender: data.message.user_id === prev.id
                            }]
                        };
                    }
                });
                // Remove from tempMessages
                setTempMessages(prev => prev.filter(msg =>
                    !(msg.tempId && msg.id === data.message.sync_id)
                ));

                // Update local storage
                localStorage.setItem('tempMessages', JSON.stringify(
                    JSON.parse(localStorage.getItem('tempMessages') || '[]')
                        .filter(msg => !(msg.tempId && msg.id === data.message.sync_id))
                ));
                scrollToBottom();

            });
    };
    useEffect(() => {
        const storedTempMessages = JSON.parse(localStorage.getItem('tempMessages') || '[]');
        console.log(storedTempMessages)
        setTempMessages(storedTempMessages);
        setChat(prev => ({
            ...prev,
            messages: Array.isArray(prev.messages) ? [...prev.messages, ...storedTempMessages] : storedTempMessages
        }));

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

                // setFile(prevFiles => [
                //     ...prevFiles,
                //     {
                //         file: file,
                //         url: URL.createObjectURL(file),
                //         tempId: result.id // Assuming the server returns an id for the temporary file
                //     }
                // ]);
                setPreview({
                    file: file,
                    url: URL.createObjectURL(file),
                    type:file.type
                })

                setValue("file", result)
                setValue("type", file.type)
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
        setPreview(null)
    };

    // const handleclear = (url) => {
    //     setFile(prevFiles => prevFiles.filter(file => file.url !== url));
    // }

    //close Ticket
    const [ticketClose, SetTicketClose] = React.useState(false);
    const [file, setFile] = React.useState([]);
    const [preview, setPreview] = React.useState();
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const fileTypes = ["application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint","text/plain", "application/pdf"]

    const handleKeyDown = (event) => {
        console.log(event.key)
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents default enter behavior (new line)
            handleSubmit(onSubmit)();
        }
    };
    const groupMessagesByDate = (messages) => {
        const groups = {};
        if (Array.isArray(messages)) {
            messages.forEach(message => {
                if (message && message.day) {
                    const date = new Date(message.day).toLocaleDateString('fa-IR');
                    if (!groups[date]) {
                        groups[date] = [];
                    }
                    groups[date].push(message);
                }
            });
        }
        return groups;
    };

    const toPersianNumber = (time) => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const [hours, minutes] = time.split(':');
        return `${hours.replace(/\d/g, x => persianDigits[x])}:${minutes.replace(/\d/g, x => persianDigits[x])}`;
    };
    return (
        <Box position="fixed" onKeyDown={handleKeyDown} dir="rtl" height="92vh"
             sx={{
                 width: '100%',
                 '@media (min-width: 900px)': {width: '88%',},
                 '@media (min-width: 1200px)': {width: '90%',}
                 ,'@media (min-width: 1500px)': {width: '91.5%',}
                 ,'@media (min-width: 1900px)': {width: '94%',}
             }}  marginTop={{xs: 9, md: 3}} p={{xs: 1, md: 7}} >
            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={() => {
                    setOpenSnack(false);
                }}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
            >
                <Alert
                    onClose={() => {
                        setOpenSnack(false);
                    }}
                    severity={status}
                    sx={{width: "100%"}}
                >
                    {message}
                </Alert>
            </Snackbar>
            <Grid item display="flex" p={{xs: 1, md: 3}} height="auto" flexDirection="column"
                  borderRadius="20px" bgcolor="white" width="100%">
                <Box display="flex" justifyContent="space-between" width="100%" mb={2}>
                    {/*<Typography sx={{height: "10%"}}>*/}
                    {/*    تيكت باز شده در{Messages?.data?.create}*/}
                    {/*</Typography>*/}
                    <Button disabled={ticketClose} onClick={() => closeTicket.mutate()} variant="contained"
                            sx={{width: "10%", pl: 2, borderRadius: "20px",mr:1}}>
                        بستن تیکت
                    </Button>
                </Box>
                {/*<Divider sx={{mt: "10px"}}/>*/}
                <Box display="flex" flexDirection="row" width="100%" gap={2}>
                    <Box display="flex" boxShadow={3} bgcolor={theme.palette.Primary[20]} borderRadius="20px"
                         flexDirection="column" p={1} width={{xs: "100%", md: "60%"}}>
                        <Typography fontWeight="900">
                            {Messages?.data?.ticket_title}
                        </Typography>
                        {/*<Typography>آخرین آپدیت در{Messages?.data?.update}</Typography>*/}
                        <Box sx={{
                            height: window.screen.height - 300,
                            overflowY: 'auto'
                        }}>
                            <Box width="100%" ref={chatBoxRef} display="flex" justifyContent="flex-end"
                                 flexDirection="column" p={1}>
                                {Object.entries(groupMessagesByDate([...(chat?.messages || []), ...tempMessages])).map(([date, messages]) => (
                                    <Box key={date}>
                                        <Typography align="center" my={2} fontSize={12} color="gray">
                                            {date}
                                        </Typography>
                                        {messages.map((item, index) => (
                                            <Box
                                                key={index}
                                                display="flex"
                                                justifyContent={item.is_sender ? "start" : "end"}
                                                flexDirection="row"
                                                gap={1}
                                            >
                                                {item.type === 'audio' ? (
                                                    <>
                                                        {!item.is_sender && <Typography fontSize={10} mt={3}
                                                                                        color="gray">{toPersianNumber(item.time)}</Typography>}
                                                        <Box display="flex" width="50%" justifyContent={item.is_sender ? "flex-start" : "flex-end"} mt={1}>
                                                            <audio src={item.audio} controls/>
                                                        </Box>
                                                        {item.is_sender && <Typography fontSize={10} mt={3}
                                                                                       color="gray">{toPersianNumber(item.time)}</Typography>}
                                                    </>
                                                ) : imageTypes.includes(item.type) ? (
                                                    <>
                                                        {!item.is_sender && <Typography fontSize={10}
                                                                                        color="gray">{toPersianNumber(item.time)}</Typography>}
                                                        <img
                                                            src={item.url}
                                                            style={{
                                                                objectFit: "cover",
                                                                width: "50%",
                                                                height: "50%",
                                                                aspectRatio: "1/1",
                                                                borderRadius: 20,
                                                                margin: "2px"
                                                            }}
                                                            onClick={() => handleImageClick(item.url)}
                                                        />
                                                        {item.is_sender && <Typography fontSize={10}
                                                                                       color="gray">{toPersianNumber(item.time)}</Typography>}
                                                    </>
                                                ) : fileTypes.includes(item.type) ? (
                                                    <>
                                                        {!item.is_sender && <Typography mt={2.5} fontSize={10}
                                                                                        color="gray">{toPersianNumber(item.time)}</Typography>}
                                                    <a
                                                        href={`${window.location.origin}${item.url}`}
                                                        style={{
                                                            textDecoration: 'none',
                                                            color: 'inherit',
                                                            display: 'block',
                                                            maxWidth: '50%'
                                                        }}
                                                    >
                                                        <Typography
                                                            bgcolor={item.is_sender ? "gray" : "white"}
                                                            borderRadius="20px"
                                                            width="100%"
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            gap={1}
                                                            p={1}
                                                            mt={1}
                                                            style={{
                                                                wordBreak: 'break-word',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {item.type}
                                                            <FolderIcon/>
                                                        </Typography>
                                                    </a>
                                                        {item.is_sender && <Typography mt={2.5} fontSize={10}
                                                                                        color="gray">{toPersianNumber(item.time)}</Typography>}
                                                    </>
                                                ) : (
                                                    <>
                                                        {!item.is_sender && <Typography mt={2.5} fontSize={10}
                                                                                        color="gray">{toPersianNumber(item.time)}</Typography>}
                                                        <Typography
                                                            bgcolor={item.is_sender ? theme.palette.Primary[30] : "white"}
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
                                                        {item.is_sender && <Typography mt={2.5} fontSize={10}
                                                                                       color="gray">{toPersianNumber(item.time)}</Typography>}
                                                    </>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                ))}
                            </Box>
                            <Box width="70%" bgcolor={alpha('#B80B0B', 0.3)} height="100px" borderRadius="20px"
                                 display={ticketClose ? "flex" : "none"} justifyContent="center" alignItems="center">
                                <Typography>
                                    تیکت بسته شده
                                </Typography>
                            </Box>
                        </Box>
                        <TextField
                            disabled={ticketClose}
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
                                    backgroundColor: theme.palette.Primary[30], borderRadius: '20px',
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
                                            <IconButton disabled={ticketClose}>
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
                                                        disabled={ticketClose}
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
                                            <MenuItem sx={{padding: 0}} disabled={ticketClose}>
                                                <EmojiPicker height={500}
                                                             onEmojiClick={onClickShowEmoji}/>
                                            </MenuItem>
                                        </Menu>
                                        <Box height="100%" display="flex" alignItems="center">
                                            <input accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                                                text/plain, application/pdf, image/*" id="icon-button-file" type="file"
                                                   style={{display: "none"}} onChange={handleChange}/>
                                            <label htmlFor="icon-button-file">
                                                <IconButton color="primary" component="span" disabled={ticketClose}>
                                                    <AttachFileIcon/>
                                                </IconButton>
                                            </label>
                                        </Box>
                                    </>
                                ),
                            }}
                        ></TextField>
                    </Box>
                    <Box width="38%" boxShadow={3} bgcolor={theme.palette.Primary[20]} borderRadius="20px"
                         display={{xs: "none", md: "flex"}} alignItems="start" flexDirection='column' p={1}>
                        <Typography fontWeight="900" mt={2}>جزییات</Typography>
                        <Divider sx={{mt: "10px"}}/>
                        <Typography mt={2} fontWeight="500">فایل های پیوست</Typography>
                        <Box display="flex" gap={2} flexDirection="column" width="463px" sx={{
                            height: window.screen.height - 300,
                            overflowY: 'auto'
                        }}>
                            {file?.map((item, index) =>
                                <Box display="flex"  flexDirection="row" width={{md:'50%',lg:"88%",xs:"100%"}} height="40%" alignItems="center"
                                     gap={2}>
                                    {imageTypes.includes(item?.type) ?
                                        <>
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
                                        {/*<Typography> ارسال شده در</Typography>*/}
                                        <Typography>{item.image_create}</Typography>
                                    </Box>
                                        </>
                                        :
                                        <>
                                        <Typography
                                        bgcolor={theme.palette.Primary[30]}
                                        borderRadius="20px"
                                        width="100%"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        gap={1}
                                        p={1}
                                        mt={1}
                                        style={{
                                        wordBreak: 'break-word',
                                        cursor: 'pointer'
                                    }}
                                        >
                                    {item?.type}
                                        <FolderIcon/>
                                        </Typography>
                                        <Box display="flex" flexDirection="column">
                                        {/*<Typography> ارسال شده در</Typography>*/}
                                        <Typography>{item.image_create}</Typography>
                                        </Box>
                                        </>
                                    }
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
                                    width: {xs: "70vw", md: '30vw'}, // Reduced from 40vw to 30vw
                                    maxHeight: '90vh',
                                    // backgroundColor: "#F4F4F4",
                                    borderRadius: "20px",
                                    display: "flex",
                                    flexDirection: "column", // Changed to column for better layout
                                    alignItems: "center", // Center items horizontally
                                    padding: "20px", // Added padding for better spacing
                                }}
                            >
                                <img
                                    src={selectedImage}
                                    alt="Full screen preview"
                                    style={{
                                        objectFit: 'contain',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </Box>
                        </Modal>
                        <Modal
                            open={preview}
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
                                    width: {xs: "70vw", md: '30vw'}, // Reduced from 40vw to 30vw
                                    maxHeight: '90vh',
                                    backgroundColor: "#F4F4F4",
                                    borderRadius: "20px",
                                    display: "flex",
                                    flexDirection: "column", // Changed to column for better layout
                                    alignItems: "center", // Center items horizontally
                                    padding: "20px", // Added padding for better spacing
                                }}
                            >
                            {imageTypes.includes(preview?.type) ?
                                <img
                                    src={preview?.url}
                                    alt="Full screen preview"
                                    style={{
                                        width: '100%', // Changed to 100% to fit the reduced box width
                                        height: 'auto', // Changed to auto to maintain aspect ratio
                                        maxHeight: '70vh', // Added max height to ensure it fits in the box
                                        objectFit: 'contain',
                                        borderRadius: "20px",
                                        marginBottom: "10px" // Added margin to separate from the button
                                    }}
                                />
                            :
                                <Typography
                                    bgcolor={theme.palette.Primary[30]}
                                    borderRadius="20px"
                                    width="100%"
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    gap={1}
                                    p={1}
                                    mt={1}
                                    style={{
                                        wordBreak: 'break-word',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {preview?.type}
                                    <FolderIcon/>
                                </Typography>

                            }
                                <IconButton onClick={handleSubmit(onSubmit)}
                                            sx={{
                                                backgroundColor: "#E0E0E0", // Added a background color
                                                '&:hover': {
                                                    backgroundColor: "#D0D0D0", // Darker shade on hover
                                                },
                                                padding: "12px", // Increased padding for a larger button
                                            }}
                                >
                                    <SendIcon sx={{fontSize: "1.5rem"}}/> {/* Increased icon size */}
                                </IconButton>
                            </Box>
                        </Modal>
                        <Modal
                            open={emojiModalOpen}
                            onClose={closeEmojiModal}
                            aria-labelledby="emoji-modal"
                            aria-describedby="emoji-picker-modal"
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    p: 4,
                                    borderRadius: 2,
                                }}
                            >
                                <EmojiPicker
                                    height={400}
                                    width={350}
                                    onEmojiClick={(emojiData, event) => {
                                        onClickShowEmoji(emojiData, event);
                                        // closeEmojiModal();
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
