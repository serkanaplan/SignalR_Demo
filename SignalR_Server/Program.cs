using SignalR_Server.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    // options.AddDefaultPolicy(policy => policy
    //     .AllowAnyOrigin()
    //     .AllowCredentials()
    //     .AllowAnyHeader()
    //     .AllowAnyMethod());
    options.AddPolicy("CorsPolicy", policy => policy
        .WithOrigins("http://localhost:3000")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

var app = builder.Build();

// app.UseCors();
app.UseCors("CorsPolicy");
app.UseRouting();

app.MapControllers();

app.MapHub<MyHub>("/myhub");

app.Run();
