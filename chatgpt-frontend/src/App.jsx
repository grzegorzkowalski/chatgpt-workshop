import { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';

function App() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const suggestedQuestions = [
        "What are the opening hours of La Cuisine?",
        "What are the specials at La Cuisine?",
        "Does La Cuisine have vegetarian options?",
        "Can I make a reservation for dinner?",
        "What is the address of La Cuisine?",
        "What payment methods are accepted?",
        "Do you offer gluten-free options?",
        "Is there outdoor seating available?",
        "What is the most popular dish?",
        "Are there any current promotions or discounts?"
    ];

    const sendMessage = async () => {
        try {
            const res = await axios.post('https://localhost:7019/api/Chat/send', { message });
            console.log(res.data.choices[0].message.content);

            setResponse(res.data.choices[0].message.content);
        } catch (error) {
            console.error(error);
            setResponse('Error communicating with backend.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h4" gutterBottom>ChatGPT Restaurant Chatbot</Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question about La Cuisine..."
                    variant="outlined"
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={sendMessage} fullWidth>
                    Send
                </Button>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Suggested Questions:</Typography>
                    <List>
                        {suggestedQuestions.map((question, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton onClick={() => setMessage(question)}>
                                    <ListItemText primary={question} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Response:</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {response}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default App;