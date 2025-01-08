# Warsztat Integracji React + C# .NET z API ChatGPT

## Przygotowanie przed warsztatem
### Zainstalowane narzędzia:
- Node.js i npm
- Visual Studio (dla C# .NET)
- Visual Studio Code (dla React)
- Postman (do testowania API)
- API Key ChatGPT: Przygotuj klucz dostępu z OpenAI

---

## Plan warsztatu (3 godziny)

### I. Wprowadzenie (15 minut)
- Wyjaśnienie celu warsztatu.
- Omówienie, jak działa API ChatGPT (endpointy, autoryzacja, limity).
- Szybkie demo aplikacji, którą uczestnicy stworzą.

---

### II. Stworzenie backendu w C# .NET (45 minut)
#### Krok 1: Utworzenie projektu
- Uruchom Visual Studio.
- Stwórz nowy projekt typu **ASP.NET Core Web API**.
- Skonfiguruj routing w pliku `Program.cs`.

#### Krok 2: Endpoint dla ChatGPT
- Stwórz kontroler (np. `ChatController`).
- Dodaj endpoint typu POST, który przyjmie pytanie od użytkownika.

#### Krok 3: Komunikacja z API ChatGPT
- Zainstaluj bibliotekę `HttpClient` (do obsługi HTTP).
- Skonfiguruj żądanie do endpointu ChatGPT.
- Pobierz odpowiedź i przekaż ją z powrotem do klienta.

#### Testowanie backendu
- Użyj Postmana do wysłania żądań i testowania odpowiedzi.

---

### III. Stworzenie frontendu w React (45 minut)
#### Krok 1: Utworzenie projektu React
- Użyj `npm create vite@latest` do stworzenia projektu.
- Zainstaluj bibliotekę `axios` do komunikacji z backendem.
- Zainstaluj **Material-UI** dla stylizacji interfejsu.

#### Krok 2: Interfejs użytkownika
- Dodaj prosty formularz z polem tekstowym i przyciskiem "Wyślij".
- Wyświetl listę sugerowanych pytań z możliwością ich wyboru.
- Użyj Material-UI do poprawy estetyki interfejsu.

#### Krok 3: Wywołanie backendu
- Dodaj funkcję do obsługi formularza.
- Wykorzystaj `axios` do wysłania danych do endpointu backendu.
- Wyświetl odpowiedź z ChatGPT na ekranie.

---

### IV. Połączenie backendu i frontendu (30 minut)
- Skonfiguruj **CORS** w projekcie .NET.
- Uruchom jednocześnie backend i frontend.
- Przetestuj komunikację pełnego przepływu danych.

---

### V. Rozszerzenia i ćwiczenia (30 minut)
1. **Dodanie historii rozmów:**
   - Użyj `useState` do przechowywania wcześniejszych wiadomości.
2. **Obsługa błędów:**
   - Dodaj komunikaty o błędach, jeśli backend lub API ChatGPT zwróci błąd.

---

### VI. Podsumowanie (15 minut)
- Omówienie wyzwań, jakie napotkali uczestnicy.
- Dyskusja o możliwościach dalszego rozwoju aplikacji (np. dodanie funkcji logowania).


// === Warsztat Integracji React + C# .NET z API ChatGPT ===

// === CZĘŚĆ 1: BACKEND W C# .NET ===

// === Krok 1: Utworzenie projektu ===
// 1. Otwórz Visual Studio i stwórz nowy projekt "ASP.NET Core Web API".
// 2. Nazwij projekt "ChatGPTBackend".
// 3. W pliku Program.cs skonfiguruj aplikację:

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.MapControllers();

app.Run();

// === Krok 2: Stwórz kontroler ===
// 1. Dodaj folder "Controllers".
// 2. Stwórz plik "ChatController.cs":

using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public ChatController()
    {
        _httpClient = new HttpClient();
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
    {
        var apiKey = "YOUR_API_KEY"; // Wstaw swój klucz API ChatGPT
        var apiUrl = "https://api.openai.com/v1/chat/completions";

        var payload = new
        {
            model = "gpt-4",
            messages = new[]
            {
                new { role = "system", content = "You are a helpful chatbot specializing in answering questions about the restaurant 'La Cuisine'." },
                new { role = "user", content = request.Message }
            }
        };

        var json = JsonSerializer.Serialize(payload);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
        httpContent.Headers.Add("Authorization", $"Bearer {apiKey}");

        var response = await _httpClient.PostAsync(apiUrl, httpContent);
        var responseContent = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            return Ok(responseContent);
        }
        else
        {
            return StatusCode((int)response.StatusCode, responseContent);
        }
    }
}

public class ChatRequest
{
    public string Message { get; set; }
}

// === Krok 3: Testuj backend ===
// 1. Użyj Postmana do wysłania POST na adres http://localhost:5000/api/chat/send
// 2. Prześlij JSON: {"message": "What are the opening hours of La Cuisine?"}

// === CZĘŚĆ 2: FRONTEND W REACT ===

// === Krok 1: Utworzenie projektu ===
// 1. W terminalu uruchom:
//    npm create vite@latest chatgpt-frontend --template react
// 2. Przejdź do katalogu projektu:
//    cd chatgpt-frontend
// 3. Zainstaluj zależności:
//    npm install
// 4. Zainstaluj axios:
//    npm install axios
// 5. Zainstaluj Material-UI:
//    npm install @mui/material @emotion/react @emotion/styled

// === Krok 2: Interfejs użytkownika ===
// W pliku src/App.jsx:

import React, { useState } from 'react';
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
      const res = await axios.post('http://localhost:5000/api/chat/send', {
        message: message,
      });
      setResponse(JSON.parse(res.data).choices[0].message.content);
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

// === Krok 3: Uruchom aplikację ===
// 1. Uruchom backend w Visual Studio (F5).
// 2. Uruchom frontend:
//    npm run dev
// 3. Zadaj pytania, np. "What are the specials at La Cuisine?" lub "Does La Cuisine have vegetarian options?"
