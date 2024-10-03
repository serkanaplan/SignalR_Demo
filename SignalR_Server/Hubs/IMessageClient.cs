
namespace SignalR_Server.Hubs;

public interface IMessageClient
{
    Task ReceiveMessage(string message);
    Task MyMessage(string user,string message);
    Task Clients(List<string> clients);
    Task UserConnected(string id);
    Task UserDisconnected(string id);
}