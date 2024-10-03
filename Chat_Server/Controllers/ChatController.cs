using Chat_Server.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Chat_Server.Controllers;


[ApiController]
[Route("[controller]")]
public class ChatController(IHubContext<ChatHub> hubContext) : ControllerBase
{
    private readonly IHubContext<ChatHub> _hubContext = hubContext;

    [HttpPost("send-to-all")]
    public async Task<IActionResult> SendToAll(string message)
    {
        // Tüm bağlı istemcilere mesaj gönderir
        await _hubContext.Clients.All.SendAsync("ReceiveMessage", "System", message);
        return Ok();
    }

    [HttpPost("send-to-caller")]
    public async Task<IActionResult> SendToCaller(string connectionId, string message)
    {
        // Sadece çağıran istemciye mesaj gönderir
        await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", "System", message);
        return Ok();
    }

    [HttpPost("send-to-others")]
    public async Task<IActionResult> SendToOthers(string connectionId, string message)
    {
        // Çağıran istemci hariç diğer tüm istemcilere mesaj gönderir
        await _hubContext.Clients.AllExcept(connectionId).SendAsync("ReceiveMessage", "System", message);
        return Ok();
    }

    [HttpPost("send-to-group")]
    public async Task<IActionResult> SendToGroup(string groupName, string message)
    {
        // Belirli bir gruptaki tüm istemcilere mesaj gönderir
        await _hubContext.Clients.Group(groupName).SendAsync("ReceiveMessage", "System", message);
        return Ok();
    }

    [HttpPost("send-to-group-except")]
    public async Task<IActionResult> SendToGroupExcept(string groupName, string connectionId, string message)
    {
        // Belirli bir gruptaki, belirli bir istemci hariç diğer tüm istemcilere mesaj gönderir
        await _hubContext.Clients.GroupExcept(groupName, connectionId).SendAsync("ReceiveMessage", "System", message);
        return Ok();
    }

    [HttpPost("send-to-groups")]
    public async Task<IActionResult> SendToGroups(List<string> groupNames, string message)
    {
        // Birden fazla gruptaki tüm istemcilere mesaj gönderir
        await _hubContext.Clients.Groups(groupNames).SendAsync("ReceiveMessage", "System", message);
        return Ok();
    }

    [HttpPost("send-to-others-in-group")]
    public async Task<IActionResult> SendToOthersInGroup(string groupName, string connectionId, string message)
    {
        // Belirli bir gruptaki, çağıran istemci hariç diğer tüm istemcilere mesaj gönderir
        await _hubContext.Clients.GroupExcept(groupName, connectionId).SendAsync("ReceiveMessage", "System", message);
        return Ok();
    }

    [HttpPost("send-to-user")]
    public async Task<IActionResult> SendToUser(string userId, string message)
    {
        // Belirli bir kullanıcıya mesaj gönderir
        await _hubContext.Clients.User(userId).SendAsync("ReceiveMessage", "System", message);
        return Ok();
    }

    [HttpPost("send-to-users")]
    public async Task<IActionResult> SendToUsers(List<string> userIds, string message)
    {
        // Birden fazla kullanıcıya mesaj gönderir
        await _hubContext.Clients.Users(userIds).SendAsync("ReceiveMessage", "System", message);
        return Ok();
    }
}