using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalR_Server.Dtos;
using SignalR_Server.Hubs;

namespace SignalR_Server.Controllers;


[ApiController]
[Route("api/[controller]")]
public class HomeController(IHubContext<MyHub, IMessageClient> hubContext) : ControllerBase
{

// IHubContext kullanımı, SignalR ile bir hub'daki istemcilere hub dışında (örneğin bir API controller'ında) mesaj göndermeyi sağlar. 
// Bu özellik genellikle, sunucunun belirli olaylar üzerine SignalR istemcilerine mesaj göndermesi gerektiğinde (örneğin, bir veritabanı işlemi tamamlandığında ya da başka bir dış olay meydana geldiğinde) kullanılır.
    private readonly IHubContext<MyHub, IMessageClient> _hubContext = hubContext;

    [HttpPost("broadcast")]
    public async Task<IActionResult> Broadcast([FromBody] MessageDto message)
    {
        await _hubContext.Clients.All.MyMessage(message.User, message.Text);
        return Ok();
    }
}
