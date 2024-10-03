namespace Chat_Server.Hubs;

using Chat_Server.Data;
using Chat_Server.Models;
using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
  public async Task GetNickName(string nickName)
  {
    Client client = new()
    {
      ConnectionId = Context.ConnectionId,
      NickName = nickName
    };
    ClientSource.Clients.Add(client);
    Clients.Others.SendAsync("clientJoined", nickName);
  }
}