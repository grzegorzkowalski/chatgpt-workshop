using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ChatGPTWorkshop.Controllers
{
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
            var apiKey = "api key"; // Wstaw swój klucz API ChatGPT
            var apiUrl = "https://api.openai.com/v1/chat/completions";

            var payload = new
            {
                model = "gpt-4o-mini",
                store = true,
                messages = new[]
                {
                new { role = "system", content = "You are a helpful chatbot specializing in answering questions about the restaurant 'La Cuisine' in Paris." },
                new { role = "user", content = request.Message }
            }
            };

            var json = JsonSerializer.Serialize(payload);
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, apiUrl)
            {
                Content = httpContent
            };
            httpRequest.Headers.Add("Authorization", $"Bearer {apiKey}");

            var response = await _httpClient.SendAsync(httpRequest);
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
}