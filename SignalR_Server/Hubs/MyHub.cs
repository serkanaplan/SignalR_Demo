using Microsoft.AspNetCore.SignalR;

namespace SignalR_Server.Hubs;

// public class MyHub : Hub
public class MyHub : Hub<IMessageClient>
{
    static readonly List<string> clients = [];
    public async Task SendMessageAsync(string message)
    {
        // await Clients.All.SendAsync("ReceiveMessage", message);
        // yukarıdaki kullnım yerine interfacelerden yararlanarak daha temiz,okunabilir ve güvenli çalışabiliyoruz
        await Clients.All.ReceiveMessage(message);
    }

    public async Task MyMessageAsync(string user,string message)
    {
        await Clients.All.MyMessage(user,message);
    }

    public override async Task OnConnectedAsync()
    {
        // Bağlantı başarılı olduğunda yapılacak işlemler
        clients.Add(Context.ConnectionId);
        // await Clients.All.SendAsync("clients", clients);
        // await Clients.All.SendAsync("UserConnected", Context.ConnectionId);
        await Clients.All.Clients(clients);
        await Clients.All.UserConnected(Context.ConnectionId);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Bağlantı koptuğunda yapılacak işlemler
        clients.Remove(Context.ConnectionId);
        // await Clients.All.SendAsync("Clients", clients);
        // await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId);
        await Clients.All.Clients(clients);
        await Clients.All.UserDisconnected(Context.ConnectionId);
    }
}